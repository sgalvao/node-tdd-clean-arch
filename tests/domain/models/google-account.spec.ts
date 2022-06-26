import { GoogleAccount } from '@/domain/models'

describe('GoogleAccount', () => {
  const googleData = {
    name: 'any_google_name',
    email: 'any_google_email',
    googleId: 'any_google_id'
  }

  it('should create with google data only ', () => {
    const sut = new GoogleAccount({
      name: 'any_google_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })

    expect(sut).toEqual({
      name: 'any_google_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
  })

  it('should update name if its empty', () => {
    const accountData = {
      id: 'any_id'
    }

    const sut = new GoogleAccount(googleData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_google_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
  })

  it('shouldnt update name if its not empty ', () => {
    const accountData = {
      id: 'any_id',
      name: 'no_update_name'
    }

    const sut = new GoogleAccount(googleData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'no_update_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
  })
})
