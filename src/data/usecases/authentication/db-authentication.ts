import { Authentication, AuthenticationDTO } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/loadAccountByEmailRepository'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}
  async auth (authentication: AuthenticationDTO): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)

    return null
  }
}
