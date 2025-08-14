import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { COMMON_SCHEMA_OPTIONS } from '../../common/base.schema'

export type SettingsDocument = Settings & Document

@Schema(COMMON_SCHEMA_OPTIONS)
export class Settings {
  @Prop({ default: 'settings' }) docType!: 'settings'
  @Prop({ default: 'Cafeteria Vote System' }) siteTitle!: string
  @Prop({ default: false }) maintenanceMode!: boolean
  @Prop({ default: 'default' }) themeCode!: string // 'default' | 'bayram' | ...
}
export const SettingsSchema = SchemaFactory.createForClass(Settings)
