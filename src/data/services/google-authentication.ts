import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { CreateGoogleAccountRepository, LoadUserAccountRepository, UpdateGoogleAccountRepository } from '../contracts/repos'

export class GoogleAuthenticationService {
  constructor (private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateGoogleAccountRepository & UpdateGoogleAccountRepository
  ) {}

  async execute (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.loadGoogleUserApi.loadUser(params)
    if (googleData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: googleData.email })
      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithGoogle({
          id: accountData.id,
          name: accountData?.name ?? googleData.name,
          googleId: googleData.googleId
        })
      } else {
        await this.userAccountRepo.createFromGoogle(googleData)
      }
    }
    return new AuthenticationError()
  }
}
