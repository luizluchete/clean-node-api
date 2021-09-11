import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher {
  constructor (private readonly salt: number) {}
  async hash (value: string): Promise<String> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
