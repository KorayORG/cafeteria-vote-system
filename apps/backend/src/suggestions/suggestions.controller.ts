import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { SuggestionsService } from './suggestions.service'

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly svc: SuggestionsService) {}

  // Üye: 300 karaktere kadar mesaj
  @Post()
  create(@Body() body: { userId: string; message: string }) {
    if (!body?.message || body.message.length > 300) {
      return { ok: false, message: 'Mesaj 1-300 karakter olmalı' }
    }
    return this.svc.create(body.userId, body.message)
  }

  // Mutfak/Admin: Listeleme (okundu/okunmadı filtresi opsiyonel)
  // /suggestions?isRead=true|false
  @Get()
  list(@Query('isRead') isRead?: 'true'|'false') {
    return this.svc.list(isRead)
  }

  // Mutfak/Admin: Görüldü olarak işaretle
  @Patch(':id/read')
  markRead(@Param('id') id: string, @Body() body?: { isRead?: boolean }) {
    return this.svc.markRead(id, body?.isRead ?? true)
  }
}
