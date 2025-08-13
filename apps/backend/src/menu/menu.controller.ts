import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { MenuService } from './menu.service'

@Controller('menu')
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  // Örn: /menu/week?start=2025-08-11
  @Get('week')
  async getWeek(@Query('start') start: string) {
    const weekStart = new Date(start)
    return this.menu.getByWeekStart(weekStart)
  }

  // Mutfak/Admin haftalık menü ekler/günceller
  @Post()
  async upsert(@Body() body: { weekStart: string; meals: any[] }) {
    const weekStart = new Date(body.weekStart)
    return this.menu.upsertByWeekStart(weekStart, body.meals as any)
  }

  @Get('recent')
  recent() {
    return this.menu.listRecent(8)
  }
}
