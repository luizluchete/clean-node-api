import { AccountModel } from '../../../domain/models/account'
import { AuthenticationDTO } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/loadAccountByEmailRepository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'any_password'
})
const makeFakeAuthentication = (): AuthenticationDTO => ({
  email: 'any_email@gmail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account = makeFakeAccount()
      return await new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepository)
  return { sut, loadAccountByEmailRepository }
}

describe('BdAuthentication UseCase', () => {
  test('Should call LoadAccountBrEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})