import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { CreateGoogleAccountRepository, LoadUserAccountRepository, UpdateGoogleAccountRepository } from '@/data/contracts/repos'
import { GoogleAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  let sut: GoogleAuthenticationService
  let loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateGoogleAccountRepository & UpdateGoogleAccountRepository>
  const token = 'any_token'

  beforeEach(() => {
    loadGoogleUserApi = mock()
    loadGoogleUserApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'any_email',
      googleId: 'any_gg_id'
    })
    userAccountRepo = mock()
    sut = new GoogleAuthenticationService(loadGoogleUserApi, userAccountRepo)
  })

  it('should call LoadGoogleApi with correct params', async () => {
    await sut.execute({ token })

    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authentication error when LoadGoogleApi returns undefined', async () => {
    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadGoogleUserApi returns data', async () => {
    await sut.execute({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateGoogleAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    await sut.execute({ token })

    userAccountRepo.load.mockResolvedValueOnce(undefined)

    expect(userAccountRepo.createFromGoogle).toHaveBeenCalledWith({ email: 'any_email', name: 'any_name', googleId: 'any_gg_id' })
    expect(userAccountRepo.createFromGoogle).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
    userAccountRepo.load.mockResolvedValueOnce({ id: 'any_id', name: 'any_name' })

    await sut.execute({ token })

    expect(userAccountRepo.updateWithGoogle).toHaveBeenCalledWith({ id: 'any_id', name: 'any_name', googleId: 'any_gg_id' })
    expect(userAccountRepo.updateWithGoogle).toHaveBeenCalledTimes(1)
  })
})
