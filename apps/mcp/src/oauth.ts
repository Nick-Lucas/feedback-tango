import { ProxyOAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/providers/proxyProvider.js'
import {
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthRouter,
  mcpAuthMetadataRouter,
} from '@modelcontextprotocol/sdk/server/auth/router.js'
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js'

// Resolve type portability error from MCP SDK
import 'qs'

import { db, oauthAccessToken, user } from '@feedback-thing/db'
import { eq } from 'drizzle-orm'
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'

const proxyProvider = new ProxyOAuthServerProvider({
  endpoints: {
    authorizationUrl: 'http://localhost:3000/api/auth/mcp/authorize',
    tokenUrl: 'http://localhost:3000/api/auth/mcp/token',
    registrationUrl: 'http://localhost:3000/api/auth/mcp/register',
  },
  verifyAccessToken,
  fetch(uri, init) {
    return fetch(uri, init)
  },
  getClient: async (client_id) => {
    console.log('[ProxyOAuthServerProvider] getClient', client_id)

    const client = await db.query.oauthApplication.findFirst({
      where(fields, operators) {
        return operators.eq(fields.clientId, client_id)
      },
    })

    if (!client) {
      throw new Error('Client not found')
    }

    return {
      client_id,
      client_secret: client.clientSecret!,
      redirect_uris: [client.redirectURLs!],
      // TODO: more stuff here?
    }
  },
})

export const oauthProxyMiddleware = mcpAuthRouter({
  provider: proxyProvider,
  issuerUrl: new URL('http://localhost:3001'),
})

// export const oauthProxyMiddleware = mcpAuthMetadataRouter({
//   oauthMetadata: {
//     // authorization_endpoint: 'http://localhost:3000/api/auth/mcp/authorize',
//     // token_endpoint: 'http://localhost:3000/api/auth/mcp/token',
//     // registration_endpoint: 'http://localhost:3000/api/auth/mcp/register',
//     // response_types_supported: ['code'],
//     // issuer: 'http://localhost:3001',
//     issuer: 'http://localhost:3001',
//     authorization_endpoint: 'http://localhost:3000/api/auth/mcp/authorize',
//     token_endpoint: 'http://localhost:3000/api/auth/mcp/token',
//     userinfo_endpoint: 'http://localhost:3000/api/auth/mcp/userinfo',
//     jwks_uri: 'http://localhost:3000/api/auth/mcp/jwks',
//     registration_endpoint: 'http://localhost:3000/api/auth/mcp/register',
//     scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
//     response_types_supported: ['code'],
//     response_modes_supported: ['query'],
//     grant_types_supported: ['authorization_code', 'refresh_token'],
//     acr_values_supported: [
//       'urn:mace:incommon:iap:silver',
//       'urn:mace:incommon:iap:bronze',
//     ],
//     subject_types_supported: ['public'],
//     id_token_signing_alg_values_supported: ['RS256', 'none'],
//     token_endpoint_auth_methods_supported: [
//       'client_secret_basic',
//       'client_secret_post',
//       'none',
//     ],
//     code_challenge_methods_supported: ['S256'],
//     claims_supported: [
//       'sub',
//       'iss',
//       'aud',
//       'exp',
//       'nbf',
//       'iat',
//       'jti',
//       'email',
//       'email_verified',
//       'name',
//     ],
//   },
//   resourceServerUrl: new URL('http://localhost:3001'),
// })

export const bearerTokenMiddleware = requireBearerAuth({
  requiredScopes: [],
  // requiredScopes: ['default'],
  resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(
    new URL('http://localhost:3001/')
  ),
  verifier: {
    verifyAccessToken,
  },
})

async function verifyAccessToken(token: string): Promise<AuthInfo> {
  // FIXME: better-auth docs are lacking in how to achieve this via the SDK with a access/bearer token
  const usersInfo = await db
    .select()
    .from(oauthAccessToken)
    .innerJoin(user, eq(oauthAccessToken.userId, user.id))
    .where(eq(oauthAccessToken.accessToken, token))
    .limit(1)

  if (usersInfo.length !== 1) {
    throw new Error('Invalid access token')
  }

  const session = usersInfo[0]
  if (!session) {
    throw new Error('Invalid access token')
  }

  return {
    token,
    clientId: session.oauth_access_token.clientId!,
    scopes: session.oauth_access_token.scopes!.split(' '),
    expiresAt: Math.floor(
      session.oauth_access_token.accessTokenExpiresAt!.valueOf()
    ),
    extra: {
      userId: session.user.id,
      userEmail: session.user.email,
    },
  }
}
