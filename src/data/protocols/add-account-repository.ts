import { CreateAccountDTO } from '../../domain/usecases/create-account'
import { AccountModel } from '../../domain/models/account'
export interface CreateAccountRepository {
  create: (createAccount: CreateAccountDTO) => Promise<AccountModel>
}
