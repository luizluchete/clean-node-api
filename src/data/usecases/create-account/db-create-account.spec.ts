
import { DbCreateAccount } from './db-create-account'
import { AccountModel, CreateAccountDTO, Hasher, CreateAccountRepository } from './db-create-account-protocols'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_value'))
    }
  }
  return new HasherStub()
}

const makeCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create (createAccount: CreateAccountDTO): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new CreateAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password'
  }
}

const makeFakeAccountData = (): CreateAccountDTO => {
  return {
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
  }
}

interface SutTypes {
  hasherStub: Hasher
  sut: DbCreateAccount
  createAccountRepositoryStub: CreateAccountRepository

}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const createAccountRepositoryStub = makeCreateAccountRepository()
  const sut = new DbCreateAccount(hasherStub, createAccountRepositoryStub)

  return { sut, hasherStub, createAccountRepositoryStub }
}

describe('DbCreateAccount UseCase', () => {
  test('Should call Hasher with correct passoword', async () => {
    const { hasherStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.create(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { hasherStub, sut } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => {
      throw new Error()
    }))
    const promise = sut.create(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateAccountRepository with correct values', async () => {
    const { createAccountRepositoryStub, sut } = makeSut()
    const createSpy = jest.spyOn(createAccountRepositoryStub, 'create')
    await sut.create(makeFakeAccountData())
    expect(createSpy).toHaveBeenCalledWith(
      {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed_value'
      }
    )
  })
  test('Should throw if CreateAccountRepository throws', async () => {
    const { sut, createAccountRepositoryStub } = makeSut()
    jest.spyOn(createAccountRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => {
      throw new Error()
    }))

    const promise = sut.create(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on sucess', async () => {
    const { sut } = makeSut()
    const account = await sut.create(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
