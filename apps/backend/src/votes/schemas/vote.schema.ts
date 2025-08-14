import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { COMMON_SCHEMA_OPTIONS } from '../../common/base.schema';

export type VoteDocument = Vote & Document;

export type ShiftCode = '08:00-16:00' | '16:00-00:00' | '00:00-08:00';
export type Choice = 'Alternative' | 'Traditional';

class VoteChoice {
  day!: string;                    // 'Pazartesi' ... 'Pazar'
  choice!: Choice;                 // 'Alternative' | 'Traditional'
}

@Schema(COMMON_SCHEMA_OPTIONS)     // tek koleksiyon için
export class Vote {
  @Prop({ default: 'vote' })
  docType!: 'vote';

  @Prop({ type: Types.ObjectId, required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  weekStart!: Date | string;       // ISO string olarak da alıp Date'e çevireceğiz

  @Prop({
    type: String,
    enum: ['08:00-16:00', '16:00-00:00', '00:00-08:00'],
    required: true,
  })
  shift!: ShiftCode;

  @Prop({
    type: [
      {
        day: { type: String, required: true },
        choice: { type: String, enum: ['Alternative', 'Traditional'], required: true },
      },
    ],
    default: [],
  })
  choices!: VoteChoice[];
}

export const VoteSchema = SchemaFactory.createForClass(Vote);

// --- index'ler ---
// Aynı kullanıcı, aynı hafta ve aynı vardiya için tek oy dokümanı olsun:
VoteSchema.index(
  { docType: 1, userId: 1, weekStart: 1, shift: 1 },
  { unique: true, partialFilterExpression: { docType: 'vote' } }
);

// weekStart'ı Date'e normalize etmek istersen hook:
VoteSchema.pre('save', function (next) {
  const self = this as any;
  if (typeof self.weekStart === 'string') self.weekStart = new Date(self.weekStart);
  next();
});
