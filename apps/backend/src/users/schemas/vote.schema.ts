import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { COMMON_SCHEMA_OPTIONS } from '../../common/base.schema'

export type VoteDocument = Vote & Document

@Schema(COMMON_SCHEMA_OPTIONS)
export class Vote {
  @Prop({ default: 'vote' }) docType!: 'vote'

  @Prop({ type: Types.ObjectId, required: true }) userId!: Types.ObjectId
  @Prop({ type: String, enum: ['08:00-16:00','16:00-00:00','00:00-08:00'], required: true }) shift!: string
  @Prop({ type: Date, required: true }) weekStart!: Date
  @Prop({
    type: [{
      day: { type: String, required: true },
      choice: { type: String, enum: ['Alternative','Traditional'], required: true }
    }],
    default: []
  }) choices!: Array<{ day: string; choice: 'Alternative'|'Traditional' }>
}
export const VoteSchema = SchemaFactory.createForClass(Vote)
