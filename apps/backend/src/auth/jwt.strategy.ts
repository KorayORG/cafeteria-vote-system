import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

function cookieExtractor(req: Request) {
  return req.cookies?.['access_token'] || null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      // Geliştirmede fallback veriyoruz; prod’da .env zorunlu olsun istiyorsan getOrThrow kullan.
      secretOrKey: cfg.get<string>('JWT_SECRET', 'dev-secret'),
    })
  }

  async validate(payload: any) {
    return { sub: payload.sub, role: payload.role }
  }
}
