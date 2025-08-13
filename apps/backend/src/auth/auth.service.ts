import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { RegisterDto, LoginDto } from './dto/auth.dto'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { JwtPayload } from './jwt.types'

const ACCESS_TTL = '15m'
const REFRESH_TTL = '7d'

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findByIdentity(dto.identityNumber)
    if (exists) throw new UnauthorizedException('Bu kimlik/pasaport ile hesap var')
    const passwordHash = await argon2.hash(dto.password)
    const user = await this.users.create({
      identityNumber: dto.identityNumber,
      fullName: dto.fullName,
      phone: dto.phone,
      passwordHash,
      role: 'Üye',
      isActive: true,
    })
    return { ok: true, userId: user.id }
  }

  private signPair(sub: string, role: JwtPayload['role']) {
    const payload: JwtPayload = { sub, role }
    const access = this.jwt.sign(payload, { expiresIn: ACCESS_TTL })
    const refresh = this.jwt.sign(payload, { expiresIn: REFRESH_TTL })
    return { access, refresh }
  }

  private setAuthCookies(res: Response, tokens: { access: string; refresh: string }) {
    const isProd = process.env.NODE_ENV === 'production'
    const common = { httpOnly: true, sameSite: 'lax' as const, secure: isProd, path: '/' }
    res.cookie('access_token', tokens.access, { ...common, maxAge: 1000 * 60 * 15 })
    res.cookie('refresh_token', tokens.refresh, { ...common, maxAge: 1000 * 60 * 60 * 24 * 7 })
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.users.findByIdentity(dto.identityNumber)
    if (!user) throw new UnauthorizedException('Kimlik veya şifre hatalı')
    const ok = await argon2.verify(user.passwordHash, dto.password)
    if (!ok) throw new UnauthorizedException('Kimlik veya şifre hatalı')
    if (!user.isActive) throw new UnauthorizedException('Hesap pasif')
    const { access, refresh } = this.signPair(user.id, user.role)
    this.setAuthCookies(res, { access, refresh })
    return { ok: true, user: { id: user.id, role: user.role, fullName: user.fullName } }
  }

  async refresh(res: Response, refreshToken?: string) {
    try {
      const payload = this.jwt.verify<JwtPayload>(refreshToken ?? '', { secret: process.env.JWT_SECRET })
      const { access, refresh } = this.signPair(payload.sub, payload.role)
      this.setAuthCookies(res, { access, refresh })
      return { ok: true }
    } catch {
      throw new UnauthorizedException('Refresh token geçersiz')
    }
  }

  logout(res: Response) {
    res.clearCookie('access_token', { path: '/' })
    res.clearCookie('refresh_token', { path: '/' })
    return { ok: true }
  }
}
