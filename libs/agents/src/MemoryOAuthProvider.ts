import type { OAuthClientProvider } from '@modelcontextprotocol/sdk/client/auth.js'
import type {
  OAuthClientMetadata,
  OAuthClientInformation,
  OAuthTokens,
  OAuthClientInformationFull,
  AuthorizationServerMetadata,
} from '@modelcontextprotocol/sdk/shared/auth.js'

// TODO: review this implementation as it was claudecode generated boilerplate
export class MemoryOAuthProvider implements OAuthClientProvider {
  // TODO: redirect flow, where is it mean to go? MCP? CLI?
  private _redirectUrl: string = 'http://localhost:3000/callback'
  private _clientMetadata: OAuthClientMetadata = {
    client_name: 'Feedback Thing CLI',
    redirect_uris: [this._redirectUrl],
    scope: '',
    // scope: 'openid email profile',
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_basic',
  }

  private _clientInfo?: OAuthClientInformation
  private _tokens?: OAuthTokens
  private _codeVerifier?: string
  private _state?: string

  get redirectUrl(): string {
    return this._redirectUrl
  }

  get clientMetadata(): OAuthClientMetadata {
    return this._clientMetadata
  }

  state(): string {
    if (!this._state) {
      this._state = Math.random().toString(36).substring(2, 15)
    }
    return this._state
  }

  clientInformation(): OAuthClientInformation | undefined {
    return this._clientInfo
  }

  saveClientInformation(clientInformation: OAuthClientInformationFull): void {
    this._clientInfo = {
      client_id: clientInformation.client_id,
      client_secret: clientInformation.client_secret,
    }
  }

  tokens(): OAuthTokens | undefined {
    return this._tokens
  }

  saveTokens(tokens: OAuthTokens): void {
    this._tokens = tokens
  }

  redirectToAuthorization(authorizationUrl: URL): void {
    console.log('Please visit this URL to authorize the application:')
    console.log(authorizationUrl.toString())
    console.log('After authorization, the callback will handle the response.')
  }

  saveCodeVerifier(codeVerifier: string): void {
    this._codeVerifier = codeVerifier
  }

  codeVerifier(): string {
    if (!this._codeVerifier) {
      throw new Error('Code verifier not found')
    }
    return this._codeVerifier
  }

  addClientAuthentication(
    headers: Headers,
    _params: URLSearchParams,
    _url: string | URL,
    _metadata?: AuthorizationServerMetadata
  ): void {
    if (this._clientInfo?.client_secret) {
      const auth = btoa(
        `${this._clientInfo.client_id}:${this._clientInfo.client_secret}`
      )
      headers.set('Authorization', `Basic ${auth}`)
    }
  }

  async validateResourceURL(
    serverUrl: string | URL,
    resource?: string
  ): Promise<URL | undefined> {
    const server = new URL(serverUrl)
    if (resource) {
      const resourceUrl = new URL(resource)
      if (resourceUrl.origin === server.origin) {
        return resourceUrl
      }
    }
    return new URL(server.origin)
  }

  invalidateCredentials(scope: 'all' | 'client' | 'tokens' | 'verifier'): void {
    switch (scope) {
      case 'all':
        delete this._clientInfo
        delete this._tokens
        delete this._codeVerifier
        delete this._state
        break
      case 'client':
        delete this._clientInfo
        break
      case 'tokens':
        delete this._tokens
        break
      case 'verifier':
        delete this._codeVerifier
        break
    }
  }
}
