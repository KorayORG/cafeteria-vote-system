import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument, Role } from './schemas/user.schema'
import * as argon2 from 'argon2'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) public readonly model: Model<UserDocument>) {}

  async ensureIndexes() {
    await this.model.createIndexes() // unique(index) kesinleşsin
  }

  findByIdentity(identityNumber: string) {
    return this.model.findOne({ identityNumber }).lean().exec()
  }

  async countUsers() {
    return this.model.estimatedDocumentCount().exec()
  }

  async createUser(input: {
    identityNumber: string
    fullName: string
    phone: string
    password: string
    role?: Role
  }) {
    const exists = await this.model.exists({ identityNumber: input.identityNumber })
    if (exists) throw new BadRequestException('Bu kimlik/pasaport numarası zaten kayıtlı.')

    const passwordHash = await argon2.hash(input.password)
    // koleksiyon yoksa burada otomatik oluşur
    const doc = await this.model.create({
      identityNumber: input.identityNumber,
      fullName: input.fullName,
      phone: input.phone,
      passwordHash,
      role: input.role ?? 'Üye',
    })
    // hassas alanları gizleyerek döndür
    const plain = doc.toObject()
    delete (plain as any).passwordHash
    return plain
  }
}
