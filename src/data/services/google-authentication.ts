import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository } from '../contracts/repos'

export class GoogleAuthenticationService {
  constructor (private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository) {}

  async execute (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.loadGoogleUserApi.loadUser(params)
    if (googleData !== undefined) {
      await this.loadUserAccountRepository.load({ email: googleData.email })
    }
    return new AuthenticationError()
  }
}
