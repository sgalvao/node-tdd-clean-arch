import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadGoogleUserApi } from '@/data/contracts/apis'

export class GoogleAuthenticationService {
  constructor (private readonly loadFacebookUserByTokenApi: LoadGoogleUserApi) {}
  async execute (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
    return new AuthenticationError()
  }
}
