import { AccountModel, CreateAccount, CreateAccountDTO, CreateAccountRepository, Encrypter } from './db-create-account.protocols'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly createAccountRepository: CreateAccountRepository) {}

  async create (createAccount: CreateAccountDTO): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(createAccount.password)
    const account = await this.createAccountRepository.create(Object.assign({}, createAccount, {
      password: hashedPassword
    }))
    return account
  }
}
