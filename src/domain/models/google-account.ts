type GoogleData = {
  name: string
  email: string
  googleId: string
}

type AccountData = {
  id: string
  name?: string
}

export class GoogleAccount {
  id?: string
  name: string
  email: string
  googleId: string

  constructor (googleData: GoogleData, account?: AccountData) {
    this.id = account?.id
    this.name = account?.name ?? googleData.name
    this.email = googleData.email
    this.googleId = googleData.googleId
  }
}
