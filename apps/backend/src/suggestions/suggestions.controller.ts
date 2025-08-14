import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common'
import { SuggestionsService } from './suggestions.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

@Controller('suggestions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuggestionsController {
  constructor(private readonly svc: SuggestionsService) {}

  @Post()
  @Roles('Üye','Mutfak','Admin')
  create(@Req() req: any, @Body() body: { message: string }) {
    const user = req.user
    if (!body?.message || body.message.length > 300) {
      return { ok: false, message: 'Mesaj 1-300 karakter olmalı' }
    }
    return this.svc.create(user.sub, body.message)
  }

  @Get()
  @Roles('Mutfak','Admin')
  list(@Query('isRead') isRead?: 'true'|'false') {
    return this.svc.list(isRead)
  }

  @Patch(':id/read')
  @Roles('Mutfak','Admin')
  markRead(@Param('id') id: string, @Body() body?: { isRead?: boolean }) {
    return this.svc.markRead(id, body?.isRead ?? true)
  }
}
