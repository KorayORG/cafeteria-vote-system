import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Vote, VoteSchema } from '../users/schemas/vote.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }])],
  exports: [MongooseModule],
})
export class VotesModule {}
