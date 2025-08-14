import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { StatsService } from './stats.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly svc: StatsService) {}

  // /stats/week?start=2025-08-11
  @Get('week')
  @Roles('Mutfak','Admin')
  week(@Query('start') start: string) {
    return this.svc.weekSummary(start)
  }
}
