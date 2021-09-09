import { AccountModel, CreateAccount, CreateAccountDTO, Encrypter } from './db-create-account.protocols'

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
