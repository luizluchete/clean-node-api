import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}
  async encrypt (value: string): Promise<String> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}