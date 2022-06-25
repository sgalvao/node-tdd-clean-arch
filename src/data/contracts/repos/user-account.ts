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
export interface CreateGoogleAccountRepository {
  createFromGoogle: (params: CreateGoogleAccountRepository.Params) => Promise<void>
}

export namespace CreateGoogleAccountRepository {
  export type Params = {
    email: string
    name: string
    googleId: string
  }

  export type Result = undefined
}

export interface UpdateGoogleAccountRepository {
  updateWithGoogle: (params: UpdateGoogleAccountRepository.Params) => Promise<void>
}

export namespace UpdateGoogleAccountRepository {
  export type Params = {
    id: string
    name: string
    googleId: string
  }

}
