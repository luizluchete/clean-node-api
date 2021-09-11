import {
  UpdateAcessTokenRepository,
  TokenGenerator,
  HashComparer,
  AuthenticationDTO,
  LoadAccountByEmailRepository,
  Authentication
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAcessTokenRepository: UpdateAcessTokenRepository
  ) {}

  async auth (authentication: AuthenticationDTO): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)

    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const acessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAcessTokenRepository.update(account.id, acessToken)
        return acessToken
      }
    }

    return null
  }
}
