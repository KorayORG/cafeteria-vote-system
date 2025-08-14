import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Settings, SettingsDocument } from './schemas/settings.schema'

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Settings.name) private model: Model<SettingsDocument>) {}
  async get() {
    let doc = await this.model.findOne({ docType: 'settings' }).lean().exec()
    if (!doc) doc = (await this.model.create({ docType: 'settings' })).toObject()
    return doc
  }
  async update(partial: Partial<Settings>) {
    return this.model.findOneAndUpdate({ docType: 'settings' }, { $set: partial }, { upsert: true, new: true }).lean().exec()
  }
}
