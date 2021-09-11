import { Authentication, AuthenticationDTO } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (authentication: AuthenticationDTO): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)

    if (!account) {
      return null
    }

    await this.hashComparer.compare(authentication.password, account.password)
  }
}
