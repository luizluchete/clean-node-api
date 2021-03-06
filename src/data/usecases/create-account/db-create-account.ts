import { AccountModel, CreateAccount, CreateAccountDTO, CreateAccountRepository, Hasher } from './db-create-account-protocols'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository) {}

  async create (createAccount: CreateAccountDTO): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(createAccount.password)
    const account = await this.createAccountRepository.create(Object.assign({}, createAccount, {
      password: hashedPassword
    }))
    return account
  }
}
