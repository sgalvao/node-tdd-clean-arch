export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}
export interface SaveGoogleAccountRepository {
  saveWithGoogle: (params: SaveGoogleAccountRepository.Params) => Promise<void>
}

export namespace SaveGoogleAccountRepository {
  export type Params = {
    id?: string
    email: string
    name: string
    googleId: string
  }

  export type Result = undefined
}
