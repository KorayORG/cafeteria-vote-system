import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { MenuService } from './menu.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  // herkes (giriş yapmış) görebilir
  @Get('week')
  @Roles('Üye','Mutfak','Admin')
  async getWeek(@Query('start') start: string) {
    const weekStart = new Date(start)
    return this.menu.getByWeekStart(weekStart)
  }

  // sadece Mutfak veya Admin günceller
  @Post()
  @Roles('Mutfak','Admin')
  async upsert(@Body() body: { weekStart: string; meals: any[] }) {
    const weekStart = new Date(body.weekStart)
    return this.menu.upsertByWeekStart(weekStart, body.meals as any)
  }

  @Get('recent')
  @Roles('Mutfak','Admin')
  recent() { return this.menu.listRecent(8) }
}
