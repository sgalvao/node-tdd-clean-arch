import { LoadGoogleUserApi } from '@/data/contracts/apis'
import {
  SaveGoogleAccountRepository,
  LoadUserAccountRepository
} from '@/data/contracts/repos'
import { GoogleAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  let sut: GoogleAuthenticationService
  let loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
  let userAccountRepo: MockProxy<
  LoadUserAccountRepository & SaveGoogleAccountRepository
  >
  const token = 'any_token'

  beforeEach(() => {
    loadGoogleUserApi = mock()
    loadGoogleUserApi.loadUser.mockResolvedValue({
      name: 'any_gg_name',
      email: 'any_gg_email',
      googleId: 'any_gg_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
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

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_gg_email'
    })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should create account with google data', async () => {
    await sut.execute({ token })

    expect(userAccountRepo.saveWithGoogle).toHaveBeenCalledWith({
      email: 'any_gg_email',
      name: 'any_gg_name',
      googleId: 'any_gg_id'
    })
    expect(userAccountRepo.saveWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('should not update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.execute({ token })

    expect(userAccountRepo.saveWithGoogle).toHaveBeenCalledWith({
      email: 'any_gg_email',
      id: 'any_id',
      name: 'any_name',
      googleId: 'any_gg_id'
    })
    expect(userAccountRepo.saveWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({ id: 'any_id' })

    await sut.execute({ token })

    expect(userAccountRepo.saveWithGoogle).toHaveBeenCalledWith({
      email: 'any_gg_email',
      id: 'any_id',
      name: 'any_gg_name',
      googleId: 'any_gg_id'
    })
    expect(userAccountRepo.saveWithGoogle).toHaveBeenCalledTimes(1)
  })
})
