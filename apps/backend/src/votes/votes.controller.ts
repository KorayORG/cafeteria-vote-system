import { Body, Controller, Get, Post, Query, Req, UseGuards, BadRequestException } from '@nestjs/common'
import { VotesService } from './votes.service'
import { SubmitVoteDto } from './dto/submit-vote.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import type { ShiftCode } from './schemas/vote.schema'

const ALLOWED_SHIFTS: ShiftCode[] = ['08:00-16:00','16:00-00:00','00:00-08:00']

@Controller('votes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VotesController {
  constructor(private readonly svc: VotesService) {}

  @Post()
  @Roles('Üye','Mutfak','Admin')
  submit(@Req() req: any, @Body() dto: SubmitVoteDto) {
    // dto.shift zaten ShiftCode (DTO'da daralttık)
    return this.svc.submit(req.user.sub, dto.weekStart, dto.shift, dto.choices)
  }

  @Get('mine')
  @Roles('Üye','Mutfak','Admin')
  mine(@Req() req: any, @Query('weekStart') weekStart: string, @Query('shift') shiftStr: string) {
    if (!ALLOWED_SHIFTS.includes(shiftStr as ShiftCode)) {
      throw new BadRequestException('Geçersiz vardiya')
    }
    const shift = shiftStr as ShiftCode
    return this.svc.getMine(req.user.sub, weekStart, shift)
  }
}
