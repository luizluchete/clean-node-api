import { AccountModel } from '../models/account'

export interface CreateAccountDTO {
  name: string
  email: string
  password: string
}

export interface CreateAccount {
  create: (account: CreateAccountDTO) => Promise<AccountModel>
}
