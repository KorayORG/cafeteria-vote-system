import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Menu, MenuDocument } from './schemas/menu.schema'

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private model: Model<MenuDocument>) {}

  // Belirli bir haftanın menüsünü getir (hafta başlangıç tarihi ile)
  getByWeekStart(weekStart: Date) {
    return this.model.findOne({ docType: 'menu', weekStart }).lean().exec()
  }

  // Haftalık menüyü oluştur/güncelle (upsert)
  upsertByWeekStart(weekStart: Date, meals: Menu['meals']) {
    return this.model.findOneAndUpdate(
      { docType: 'menu', weekStart },
      { $set: { docType: 'menu', weekStart, meals } },
      { upsert: true, new: true }
    ).lean().exec()
  }

  // Son N haftayı listele (mutfak paneli için)
  listRecent(limit = 6) {
    return this.model.find({ docType: 'menu' }).sort({ weekStart: -1 }).limit(limit).lean().exec()
  }
}
