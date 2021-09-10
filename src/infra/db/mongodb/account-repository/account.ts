import { CreateAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { CreateAccountDTO } from '../../../../domain/usecases/create-account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements CreateAccountRepository {
  async create (createAccount: CreateAccountDTO): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(createAccount)
    const newAccount = await accountCollection.findOne(result.insertedId)

    const { _id, ...accountWithoutId } = newAccount
    return Object.assign({}, accountWithoutId, { id: _id }) as AccountModel
  }
}