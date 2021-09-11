import { SignUpController } from './signup'
import { MissingParamError, ServerError } from '../../errors'
import { AccountModel, CreateAccount, CreateAccountDTO, HttpRequest, Validation } from './signup-protocols'
import { ok, serverError, badRequest } from '../../helpers/http/http-helper'

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async create (account: CreateAccountDTO): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new CreateAccountStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      id: 'valid_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    email: 'valid_email@email.com',
    name: 'valid_name',
    password: 'valid_password'
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  createAccountStub: CreateAccount
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const createAccountStub = makeCreateAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(createAccountStub, validationStub)
  return { sut, createAccountStub, validationStub }
}

describe('SignUp Controller', () => {
  test('Should call CreateAccount with correct values', async () => {
    const { sut, createAccountStub } = makeSut()
    const addSpy = jest.spyOn(createAccountStub, 'create')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      name: 'any_name',
      password: 'any_password'
    })
  })

  test('Should return 500 if CreateAccount throws', async () => {
    const { sut, createAccountStub } = makeSut()
    jest.spyOn(createAccountStub, 'create').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 is valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation withcorrect values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
