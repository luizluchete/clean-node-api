import { Encrypter } from '../../protocols/encrypter'
import { DbCreateAccount } from './db-create-account'

interface SutTypes {
  encrypterStub: Encrypter
  sut: DbCreateAccount

}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_value'))
    }
  }
  return new EncrypterStub()
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbCreateAccount(encrypterStub)

  return { sut, encrypterStub }
}

describe('DbCreateAccount UseCase', () => {
  test('Should call Encrypter with correct passoword', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.create(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
