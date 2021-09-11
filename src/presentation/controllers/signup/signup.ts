import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, CreateAccount, Validation } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (

    private readonly createAccount: CreateAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.createAccount.create({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
