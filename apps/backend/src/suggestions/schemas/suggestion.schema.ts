import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { COMMON_SCHEMA_OPTIONS } from '../../common/base.schema'

export type SuggestionDocument = Suggestion & Document

@Schema(COMMON_SCHEMA_OPTIONS)
export class Suggestion {
  @Prop({ default: 'suggestion' }) docType!: 'suggestion'

  @Prop({ type: Types.ObjectId, required: true }) userId!: Types.ObjectId
  @Prop({ type: String, maxlength: 300, required: true }) message!: string
  @Prop({ type: Boolean, default: false }) isRead!: boolean
}
export const SuggestionSchema = SchemaFactory.createForClass(Suggestion)
