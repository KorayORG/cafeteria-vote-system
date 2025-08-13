import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Suggestion, SuggestionSchema } from './schemas/suggestion.schema'
import { SuggestionsService } from './suggestions.service'
import { SuggestionsController } from './suggestions.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Suggestion.name, schema: SuggestionSchema }])],
  providers: [SuggestionsService],
  controllers: [SuggestionsController],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
