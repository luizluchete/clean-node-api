import { AccountModel } from '../../../domain/models/account'
import { CreateAccount, CreateAccountDTO } from '../../../domain/usecases/create-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbCreateAccount implements CreateAccount {
  constructor (private readonly encrypter: Encrypter) {}
  async create (account: CreateAccountDTO): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)

    return await new Promise(resolve => resolve({
      email: '',
      id: '',
      password: '',
      name: ''
    }))
  }
}
