import { ProxyOAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/providers/proxyProvider.js'
import { mcpAuthRouter } from '@modelcontextprotocol/sdk/server/auth/router.js'
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js'

// import { createAuthClient } from 'better-auth/client'

// const client = createAuthClient({baseURL: 'http://localhost:3000/api/auth'})

const proxyProvider = new ProxyOAuthServerProvider({
  endpoints: {
    authorizationUrl: 'http://localhost:3000/api/auth/mcp/authorize',
    tokenUrl: 'http://localhost:3000/api/auth/mcp/token',
    // revocationUrl: "https://auth.external.com/oauth2/v1/revoke",
  },
  verifyAccessToken: async (token) => {
    // client.getSession({})
    console.log('[ProxyOAuthServerProvider] verifyAccessToken')
    return {
      token,
      clientId: '123',
      scopes: ['openid', 'email', 'profile'],
    }
  },
  getClient: async (client_id) => {
    console.log('[ProxyOAuthServerProvider] getClient', client_id)
    return {
      client_id,
      redirect_uris: ['http://localhost:3000/callback'],
    }
  },
})

export const oauthProxyMiddleware = mcpAuthRouter({
  provider: proxyProvider,
  issuerUrl: new URL('http://localhost:3000'),
  baseUrl: new URL('http://localhost:3000/api/auth'),
  serviceDocumentationUrl: new URL('https://docs.example.com/'),
})

export const bearerTokenMiddleware = requireBearerAuth({
  requiredScopes: ['default'],
  resourceMetadataUrl: new URL(
    'http://localhost:3000/api/auth/.well-known/oauth-authorization-server'
  ).toString(),
  verifier: {
    verifyAccessToken: async (token: string) => {
      // Here you would typically verify the token with your OAuth server
      // For this example, we will just return a mock user data.
      const tokenRes = {
        user_id: '12345',
        client_id: 'client-123',
        scope: ['default'],
      }

      return {
        token,
        clientId: tokenRes?.client_id,
        scopes: tokenRes?.scope,
        // Include any extra data you want to use in the tool handlers
        extra: {
          userId: tokenRes?.user_id,
        },
      }
    },
  },
})
