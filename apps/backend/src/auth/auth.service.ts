import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { RegisterDto, LoginDto } from './dto/auth.dto'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findByIdentity(dto.identityNumber)
    if (exists) throw new Error('Bu kimlik/pasaport ile hesap var')
    const passwordHash = await argon2.hash(dto.password)
    const user = await this.users.create({
      identityNumber: dto.identityNumber,
      fullName: dto.fullName,
      phone: dto.phone,
      passwordHash,
      role: 'member',
      isActive: true,
    })
    return { ok: true, userId: user.id }
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByIdentity(dto.identityNumber)
    if (!user) return null
    const ok = await argon2.verify(user.passwordHash, dto.password)
    if (!ok) return null
    // JWT’yi sonraki paketlerde ekleyeceğiz. Şimdilik basit yanıt:
    return { ok: true, user: { id: user.id, role: user.role, fullName: user.fullName } }
  }
}
