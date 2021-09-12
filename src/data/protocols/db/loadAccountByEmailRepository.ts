import { AccountModel } from '../../../domain/models/account'

export interface LoadAccountByEmailRepository {
  findByEmail: (email: string) => Promise<AccountModel>
}
