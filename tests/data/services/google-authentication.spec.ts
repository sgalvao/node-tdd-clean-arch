import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  let sut: GoogleAuthenticationService
  let loadGoogleUserApi: MockProxy<LoadGoogleUserApi>

  beforeEach(() => {
    loadGoogleUserApi = mock()
    sut = new GoogleAuthenticationService(loadGoogleUserApi)
  })

  it('should call LoadGoogleApi with correct params', async () => {
    await sut.execute({ token: 'any_token' })

    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authentication error when LoadGoogleApi returns undefined', async () => {
    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
