import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as argon2 from 'argon2'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async register(input: { identityNumber:string; fullName:string; phone:string; password:string }) {
    // (UsersService) format/doğrulama DTO’da, benzersiz kontrol burada
    const created = await this.users.createUser(input)
    return { ok: true, user: created }
  }

  async validateLogin(identityNumber: string, password: string) {
    const user = await (this.users.model as any).findOne({ identityNumber }).select('+passwordHash').lean().exec()
    if (!user) throw new UnauthorizedException('Kimlik veya şifre hatalı')
    if (user.isActive === false) throw new UnauthorizedException('Hesap pasif durumda')

    const ok = await argon2.verify(user.passwordHash, password)
    if (!ok) throw new UnauthorizedException('Kimlik veya şifre hatalı')

    return user
  }

  async issueTokens(user: any) {
    const payload = { sub: user._id.toString(), role: user.role }
    const secret = process.env.JWT_SECRET as string
    const access = jwt.sign(payload, secret, { expiresIn: '1d' })
    return { access }
  }
}
