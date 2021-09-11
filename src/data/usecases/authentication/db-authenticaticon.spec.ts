import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/loadAccountByEmailRepository'
import { DbAuthentication } from './db-authentication'

describe('BdAuthentication UseCase', () => {
  test('Should call LoadAccountBrEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          email: 'any_email',
          name: 'any_name',
          password: 'any_password'
        }
        return await new Promise(resolve => resolve(account))
      }
    }

    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepository)
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth({
      email: 'any_email@gmail.com',
      password: 'any_password'
    })

    expect(loadSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
