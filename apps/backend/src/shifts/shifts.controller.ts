import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ShiftsService } from './shifts.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

@Controller('admin/shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class ShiftsController {
  constructor(private readonly svc: ShiftsService) {}
  @Get() list() { return this.svc.list() }
  @Post() create(@Body() body: any) { return this.svc.create(body) }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, body) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}
