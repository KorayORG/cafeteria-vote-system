import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Vote, VoteSchema } from '../votes/schemas/vote.schema'
import { StatsService } from './stats.service'
import { StatsController } from './stats.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
