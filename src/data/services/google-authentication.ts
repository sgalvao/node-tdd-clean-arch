import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { CreateGoogleAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class GoogleAuthenticationService {
  constructor (private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateGoogleAccountRepository
  ) {}

  async execute (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.loadGoogleUserApi.loadUser(params)
    if (googleData !== undefined) {
      await this.userAccountRepo.load({ email: googleData.email })
      await this.userAccountRepo.createFromGoogle(googleData)
    }
    return new AuthenticationError()
  }
}
