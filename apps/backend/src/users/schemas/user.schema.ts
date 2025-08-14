import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document
export type Role = 'Üye' | 'Mutfak' | 'Admin'

@Schema({ collection: 'members', timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  identityNumber!: string // TCKN veya pasaport

  @Prop({ required: true })
  fullName!: string

  @Prop({ required: true })
  phone!: string

  @Prop({ required: true, select: false })
  passwordHash!: string

  @Prop({ default: 'Üye' })
  role!: Role

  @Prop({ default: true })
  isActive!: boolean

  @Prop() activeFrom?: Date
  @Prop() activeTo?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
