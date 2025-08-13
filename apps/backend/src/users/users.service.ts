import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}
  findByIdentity(identityNumber: string) { return this.model.findOne({ identityNumber }).exec() }
  create(partial: Partial<User>) { return this.model.create(partial) }
}
