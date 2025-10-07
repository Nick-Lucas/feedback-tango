import { ProxyOAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/providers/proxyProvider.js'
import {
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthRouter,
} from '@modelcontextprotocol/sdk/server/auth/router.js'
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js'

// Resolve type portability error from MCP SDK
import 'qs'

import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { patchClientStoreOnProxyProvider } from './clients-store-patch.ts'

const mcpUri = new URL(process.env.MCP_URL ?? 'http://localhost:3001')
const authServerUri = new URL(
  process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
)

/**
 * See clients-store-patch.ts for explanation of why patchClientStoreOnProxyProvider is needed
 */
const proxyProvider = patchClientStoreOnProxyProvider(
  (getClient) =>
    new ProxyOAuthServerProvider({
      endpoints: {
        authorizationUrl: new URL(
          '/api/auth/mcp/authorize',
          authServerUri.origin
        ).toString(),
        tokenUrl: new URL(
          '/api/auth/mcp/token',
          authServerUri.origin
        ).toString(),
        registrationUrl: new URL(
          '/api/auth/mcp/register',
          authServerUri.origin
        ).toString(),
      },
      verifyAccessToken,
      async getClient(clientId) {
        return await getClient(clientId)
      },
    })
)

export const oauthProxyMiddleware = mcpAuthRouter({
  provider: proxyProvider,
  issuerUrl: mcpUri,
})

export const bearerTokenMiddleware = requireBearerAuth({
  requiredScopes: [],
  resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(mcpUri),
  verifier: {
    verifyAccessToken,
  },
})

async function verifyAccessToken(token: string): Promise<AuthInfo> {
  const response = await fetch(
    new URL('/api/auth/mcp/userinfo', authServerUri.origin),
    {
      headers: {
        Cookie: `better-auth.session_token=${token}`,
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    const body = await response.text()
    console.error('Failed to fetch user info:', response.status, body)

    throw new Error('Invalid access token')
  }

  type UserInfo = {
    active: true
    sub: string
    scope: string[]
    client_id: string
    exp: number
    aud: string
    user: {
      id: string
      email?: string
      name?: string
    }
  }

  const userInfo = (await response.json()) as UserInfo

  return {
    token,
    clientId: userInfo.client_id,
    scopes: userInfo.scope,
    expiresAt: Math.floor(userInfo.exp / 1000),
    extra: {
      userId: userInfo.user.id,
      userEmail: userInfo.user.email,
      userName: userInfo.user.name,
    },
  }
}
