import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Suggestion, SuggestionDocument } from './schemas/suggestion.schema'

@Injectable()
export class SuggestionsService {
  constructor(@InjectModel(Suggestion.name) private model: Model<SuggestionDocument>) {}

  create(userId: string, message: string) {
    return this.model.create({
      docType: 'suggestion',
      userId: new Types.ObjectId(userId),
      message,
      isRead: false,
    })
  }

  list(isRead?: 'true'|'false') {
    const filter: any = { docType: 'suggestion' }
    if (isRead === 'true') filter.isRead = true
    if (isRead === 'false') filter.isRead = false
    return this.model.find(filter).sort({ createdAt: -1 }).lean().exec()
  }

  markRead(id: string, read = true) {
    return this.model.findByIdAndUpdate(id, { $set: { isRead: read } }, { new: true }).lean().exec()
  }
}
