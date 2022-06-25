import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  it('should call LoadGoogleApi with correct params', async () => {
    const loadGoogleUserApi = mock<LoadGoogleUserApi>()
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    await sut.execute({ token: 'any_token' })

    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authentication error when LoadGoogleApi returns undefined', async () => {
    const loadGoogleUserApi = mock<LoadGoogleUserApi>()
    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
