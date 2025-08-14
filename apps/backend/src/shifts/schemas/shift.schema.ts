import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { COMMON_SCHEMA_OPTIONS } from '../../common/base.schema'

export type ShiftDocument = Shift & Document

@Schema(COMMON_SCHEMA_OPTIONS)
export class Shift {
  @Prop({ default: 'shift' }) docType!: 'shift'
  @Prop({ required: true, unique: true }) code!: string       // e.g. '08:00-16:00'
  @Prop({ required: true }) label!: string                     // e.g. '08:00 - 16:00'
  @Prop({ default: 0 }) order!: number
  @Prop({ default: true }) isActive!: boolean
}
export const ShiftSchema = SchemaFactory.createForClass(Shift)
