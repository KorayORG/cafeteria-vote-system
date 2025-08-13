import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document
export type Role = 'member' | 'kitchen' | 'admin'

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true }) identityNumber: string
  @Prop({ required: true }) fullName: string
  @Prop({ required: true }) phone: string
  @Prop({ required: true }) passwordHash: string
  @Prop({ default: 'member' }) role: Role
  @Prop({ default: true }) isActive: boolean
  @Prop() activeFrom?: Date
  @Prop() activeTo?: Date
}
export const UserSchema = SchemaFactory.createForClass(User)
