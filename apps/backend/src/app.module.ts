import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'   // ← eklendi
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { MenuModule } from './menu/menu.module'
import { VotesModule } from './votes/votes.module'
import { SuggestionsModule } from './suggestions/suggestions.module'
import { StatsModule } from './stats/stats.module'
import { ShiftsModule } from './shifts/shifts.module'
import { SettingsModule } from './settings/settings.module'

@Module({
  imports: [
    // .env dosyasını yükle ve global yap (monorepo için birkaç olası yol verildi)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/backend/.env', '../../.env'],
    }),

    // MONGO_URI'yi ConfigService'ten oku
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.getOrThrow<string>('MONGO_URI'),
      }),
    }),

    UsersModule,
    AuthModule,
    MenuModule,
    VotesModule,
    SuggestionsModule,
    StatsModule,
    ShiftsModule,
    SettingsModule,
  ],
})
export class AppModule {}
