import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Vote, VoteDocument } from '../votes/schemas/vote.schema'

@Injectable()
export class StatsService {
  constructor(@InjectModel(Vote.name) private model: Model<VoteDocument>) {}

  async weekSummary(weekStartISO: string) {
    const weekStart = new Date(weekStartISO)
    const pipeline = [
      { $match: { docType: 'vote', weekStart } },
      { $unwind: '$choices' },
      {
        $group: {
          _id: { day: '$choices.day', choice: '$choices.choice', shift: '$shift' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.day',
          items: {
            $push: { choice: '$_id.choice', shift: '$_id.shift', count: '$count' },
          },
          total: { $sum: '$count' },
        },
      },
      { $sort: { _id: 1 } },
    ] as any[]
    const agg = await this.model.aggregate(pipeline)
    // Kullanışlı şekle getir
    const byDay: Record<string, any> = {}
    for (const row of agg) {
      const day = row._id as string
      const data = row.items as Array<{ choice: string; shift: string; count: number }>
      const sumTraditional = data.filter(d => d.choice === 'Traditional').reduce((a,b)=>a+b.count, 0)
      const sumAlternative = data.filter(d => d.choice === 'Alternative').reduce((a,b)=>a+b.count, 0)
      byDay[day] = {
        total: row.total,
        Traditional: sumTraditional,
        Alternative: sumAlternative,
        byShift: data, // gerekirse vardiya kırılımı
      }
    }
    return { weekStart, days: byDay }
  }
}
