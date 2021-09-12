import { ObjectId } from 'bson'
import { CreateAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/loadAccountByEmailRepository'
import { UpdateAcessTokenRepository } from '../../../../data/protocols/db/update-acess-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { CreateAccountDTO } from '../../../../domain/usecases/create-account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements CreateAccountRepository, LoadAccountByEmailRepository, UpdateAcessTokenRepository {
  async create (createAccount: CreateAccountDTO): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(createAccount)
    const newAccount = await accountCollection.findOne(result.insertedId)
    return MongoHelper.map(newAccount)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAcessToken (id: string | ObjectId, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id }, { $set: { acessToken: token } })
  }
}
