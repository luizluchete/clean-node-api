import { DbCreateAccount } from './db-create-account'
describe('DbCreateAccount UseCase', () => {
  test('Should call Encrypter with correct passoword', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_value'))
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbCreateAccount(encrypterStub)
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
