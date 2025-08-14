import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class AdminUsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  async list() {
    // Güvenlik için sadece gerekli alanları projekte et
    const all = await (this.users as any).model.find({}, { passwordHash: 0 }).lean().exec()
    return all
  }

  @Patch(':id/role')
  setRole(@Param('id') id: string, @Body() body: { role: 'Üye'|'Mutfak'|'Admin' }) {
    return (this.users as any).model.findByIdAndUpdate(id, { $set: { role: body.role } }, { new: true, projection: { passwordHash: 0 } }).lean().exec()
  }

  @Patch(':id/active-range')
  setActiveRange(@Param('id') id: string, @Body() body: { activeFrom?: string; activeTo?: string; isActive?: boolean }) {
    const patch: any = {}
    if (body.isActive !== undefined) patch.isActive = body.isActive
    if (body.activeFrom) patch.activeFrom = new Date(body.activeFrom)
    if (body.activeTo) patch.activeTo = new Date(body.activeTo)
    return (this.users as any).model.findByIdAndUpdate(id, { $set: patch }, { new: true, projection: { passwordHash: 0 } }).lean().exec()
  }
}
