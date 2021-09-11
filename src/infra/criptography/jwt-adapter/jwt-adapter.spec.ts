import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  }
}))
describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')

    expect(signSpy).toBeCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should return a token on sign succees', async () => {
    const sut = new JwtAdapter('secret')
    const acessToken = await sut.encrypt('any_id')

    expect(acessToken).toBe('any_token')
  })
})
