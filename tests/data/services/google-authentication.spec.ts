import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { GoogleAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  let sut: GoogleAuthenticationService
  let loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  const token = 'any_token'

  beforeEach(() => {
    loadGoogleUserApi = mock()
    loadGoogleUserApi.loadUser.mockResolvedValue({
      name: 'any_username',
      email: 'any_email',
      googleId: 'any_id'
    })
    loadUserAccountRepo = mock()
    sut = new GoogleAuthenticationService(loadGoogleUserApi, loadUserAccountRepo)
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

  it('should call LoadUserByEmailRepo when LoadGoogleUserApi returns data', async () => {
    await sut.execute({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
