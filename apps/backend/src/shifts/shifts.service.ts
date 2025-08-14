import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Shift, ShiftDocument } from './schemas/shift.schema'

@Injectable()
export class ShiftsService {
  constructor(@InjectModel(Shift.name) private model: Model<ShiftDocument>) {}
  list() { return this.model.find({ docType: 'shift' }).sort({ order: 1 }).lean().exec() }
  create(dto: Partial<Shift>) { return this.model.create({ ...dto, docType: 'shift' }) }
  update(id: string, dto: Partial<Shift>) { return this.model.findByIdAndUpdate(id, dto, { new: true }).lean().exec() }
  remove(id: string) { return this.model.findByIdAndDelete(id).lean().exec() }
}
