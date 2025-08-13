import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { JwtPayload } from './jwt.types'

function cookieExtractor(req: Request): string | null {
  return req?.cookies?.['access_token'] ?? null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      // .env'de JWT_SECRET tanımlı olduğundan emin ol
      secretOrKey: process.env.JWT_SECRET as string,
    })
  }

  async validate(payload: JwtPayload) {
    // req.user
    return payload
  }
}
