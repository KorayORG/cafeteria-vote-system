import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { VotesModule } from './votes/votes.module'
import { SuggestionsModule } from './suggestions/suggestions.module'
import { MenuModule } from './menu/menu.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    UsersModule,
    AuthModule,
    VotesModule,
    SuggestionsModule,
    MenuModule,
  ],
})
export class AppModule {}
