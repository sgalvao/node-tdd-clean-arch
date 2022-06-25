import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { CreateGoogleAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { GoogleAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  let sut: GoogleAuthenticationService
  let loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createGoogleAccountRepo: MockProxy<CreateGoogleAccountRepository>
  const token = 'any_token'

  beforeEach(() => {
    loadGoogleUserApi = mock()
    loadGoogleUserApi.loadUser.mockResolvedValue({
      name: 'any_username',
      email: 'any_email',
      googleId: 'any_id'
    })
    createGoogleAccountRepo = mock()
    loadUserAccountRepo = mock()
    sut = new GoogleAuthenticationService(loadGoogleUserApi, loadUserAccountRepo, createGoogleAccountRepo)
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

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateGoogleAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    await sut.execute({ token })

    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)

    expect(createGoogleAccountRepo.createFromGoogle).toHaveBeenCalledWith({ email: 'any_email', name: 'any_username', googleId: 'any_id' })
    expect(createGoogleAccountRepo.createFromGoogle).toHaveBeenCalledTimes(1)
  })
})
