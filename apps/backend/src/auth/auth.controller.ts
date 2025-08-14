import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // FE ilk açılışta kontrol eder: kullanıcı var mı?
  @Get('has-users')
  async hasUsers() {
    return { hasUsers: (await this.auth['users'].countUsers()) > 0 }
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // DTO valid değilse ValidationPipe 400 dönecek (hangi alan, Türkçe mesajlarla)
    // Benzersiz kimlik kontrolü service içinde
    return this.auth.register(dto)
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateLogin(dto.identityNumber, dto.password)
    const tokens = await this.auth.issueTokens(user)
    res.cookie('access_token', tokens.access, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // prod: true (https)
      path: '/',
      maxAge: 1000*60*60*24,
    })
    return { ok: true }
  }

@UseGuards(JwtAuthGuard)
@Get('me')
me(@Req() req: any) {
  // JwtStrategy içinde req.user = { sub, role } ayarlı
  return { user: { id: req.user.sub, role: req.user.role } }
}
}
