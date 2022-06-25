import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { SaveGoogleAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class GoogleAuthenticationService {
  constructor (private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveGoogleAccountRepository
  ) {}

  async execute (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.loadGoogleUserApi.loadUser(params)

    if (googleData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: googleData.email })

      await this.userAccountRepo.saveWithGoogle({
        id: accountData?.id,
        name: accountData?.name ?? googleData.name,
        email: googleData.email,
        googleId: googleData.googleId
      })
    }
    return new AuthenticationError()
  }
}
