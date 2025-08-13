import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { RegisterDto, LoginDto } from './dto/auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) { return this.auth.register(dto) }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const res = await this.auth.login(dto)
    if (!res) throw new UnauthorizedException('Kimlik veya şifre hatalı')
    return res
  }
}
