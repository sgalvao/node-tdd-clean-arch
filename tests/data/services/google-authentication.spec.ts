import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'

class GoogleAuthenticationService {
  constructor (private readonly loadFacebookUserByTokenApi: LoadGoogleUserApi) {}
  async execute (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
    return new AuthenticationError()
  }
}

class LoadGoogleUserApiSpy implements LoadGoogleUserApi {
  token?: string
  result = undefined
  async loadUser (params: LoadGoogleUserApi.Params): Promise<LoadGoogleUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('GoogleAuthenticationService', () => {
  it('should call LoadGoogleApi with correct params', async () => {
    const loadGoogleUserApi = new LoadGoogleUserApiSpy()
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    await sut.execute({ token: 'any_token' })

    expect(loadGoogleUserApi.token).toBe('any_token')
  })

  it('should return authentication error when LoadGoogleApi returns undefined', async () => {
    const loadGoogleUserApi = new LoadGoogleUserApiSpy()
    loadGoogleUserApi.result = undefined
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})