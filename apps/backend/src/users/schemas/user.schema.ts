import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { COMMON_SCHEMA_OPTIONS } from '../../common/base.schema'

export type UserDocument = User & Document
export type Role = 'Üye' | 'Mutfak' | 'Admin'

@Schema(COMMON_SCHEMA_OPTIONS)
export class User {
  @Prop({ default: 'user' }) docType!: 'user'

  @Prop({ required: true, unique: true }) identityNumber!: string // Kimlik/Pasaport
  @Prop({ required: true }) fullName!: string
  @Prop({ required: true }) phone!: string
  @Prop({ required: true }) passwordHash!: string
  @Prop({ default: 'Üye' }) role!: Role
  @Prop({ default: true }) isActive!: boolean
  @Prop() activeFrom?: Date
  @Prop() activeTo?: Date
}
export const UserSchema = SchemaFactory.createForClass(User)

// (İsteğe bağlı) koleksiyon ismini garanti altına almak istersen:
// UserSchema.set('collection', 'cafeteria')
