import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { COMMON_SCHEMA_OPTIONS } from '../../common/base.schema'

export type MenuDocument = Menu & Document

class Dish {
  name!: string
  imageUrl?: string
  categories?: string[]
}

@Schema(COMMON_SCHEMA_OPTIONS)
export class Menu {
  @Prop({ default: 'menu' }) docType!: 'menu'

  @Prop({ type: Date, required: true }) weekStart!: Date
  @Prop({
    type: [{
      day: { type: String, required: true },
      traditional: { name: String, imageUrl: String, categories: [String] },
      alternative: { name: String, imageUrl: String, categories: [String] }
    }],
    default: []
  }) meals!: Array<{ day: string; traditional: Dish; alternative: Dish }>
}
export const MenuSchema = SchemaFactory.createForClass(Menu)
