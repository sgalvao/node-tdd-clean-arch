import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { SaveGoogleAccountRepository, LoadUserAccountRepository } from '../contracts/repos'
import { GoogleAccount } from '@/domain/models/'

export class GoogleAuthenticationService {
  constructor (private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveGoogleAccountRepository
  ) {}

  async execute (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.loadGoogleUserApi.loadUser(params)
    if (googleData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: googleData.email })
      const googleAccount = new GoogleAccount(googleData, accountData)

      await this.userAccountRepo.saveWithGoogle(googleAccount)
    }
    return new AuthenticationError()
  }
}
