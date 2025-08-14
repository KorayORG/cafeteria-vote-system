import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}
  @Get() get() { return this.svc.get() }
  @Patch('theme') setTheme(@Body() body: { themeCode: string }) { return this.svc.update({ themeCode: body.themeCode }) }
  @Patch('maintenance') setMaintenance(@Body() body: { maintenanceMode: boolean }) { return this.svc.update({ maintenanceMode: body.maintenanceMode }) }
  @Patch('title') setTitle(@Body() body: { siteTitle: string }) { return this.svc.update({ siteTitle: body.siteTitle }) }
}
