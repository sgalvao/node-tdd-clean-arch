import { GoogleAuthentication } from '@/domain/features'

class GoogleAuthenticationService {
  constructor (private readonly loadFacebookUserByTokenApi: LoadGoogleUserApi) {}
  async execute (params: GoogleAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
  }
}

interface LoadGoogleUserApi {
  loadUser: (params: LoadGoogleUserApi.Params) => Promise<void>
}

namespace LoadGoogleUserApi {
  export type Params = {
    token: string
  }
}

class LoadGoogleUserApiSpy implements LoadGoogleUserApi {
  token?: string
  async loadUser (params: LoadGoogleUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('GoogleAuthenticationService', () => {
  it('should call LoadGoogleApi with correct params', async () => {
    const loadGoogleUserApi = new LoadGoogleUserApiSpy()
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    await sut.execute({ token: 'any_token' })

    expect(loadGoogleUserApi.token).toBe('any_token')
  })
})
