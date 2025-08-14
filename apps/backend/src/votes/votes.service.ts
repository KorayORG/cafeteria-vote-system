import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vote, VoteDocument, Choice, ShiftCode } from './schemas/vote.schema';

@Injectable()
export class VotesService {
  constructor(@InjectModel(Vote.name) private model: Model<VoteDocument>) {}

  async submit(userId: string, weekStartISO: string, shift: ShiftCode, choices: { day: string; choice: Choice }[]) {
    const weekStart = new Date(weekStartISO);
    return this.model
      .findOneAndUpdate(
        { docType: 'vote', userId: new Types.ObjectId(userId), weekStart, shift },
        { $set: { docType: 'vote', userId: new Types.ObjectId(userId), weekStart, shift, choices } },
        { upsert: true, new: true }
      )
      .lean()
      .exec();
  }

  async getMine(userId: string, weekStartISO: string, shift: ShiftCode) {
    const weekStart = new Date(weekStartISO);
    return this.model
      .findOne({ docType: 'vote', userId: new Types.ObjectId(userId), weekStart, shift })
      .lean()
      .exec();
  }
}
