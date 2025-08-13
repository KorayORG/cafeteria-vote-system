import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(identityNumber: string, fullName: string, phone: string, password: string) {
    const existing = await this.users.findByIdentity(identityNumber);
    if (existing) throw new ConflictException('Kullanıcı mevcut');
    const passwordHash = await argon2.hash(password);
    const user = await this.users.create({ identityNumber, fullName, phone, passwordHash });
    return { id: user.id };
  }

  async validate(identityNumber: string, password: string) {
    const user = await this.users.findByIdentity(identityNumber);
    if (!user) throw new UnauthorizedException();
    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new UnauthorizedException();
    return user;
  }

  async login(identityNumber: string, password: string) {
    const user = await this.validate(identityNumber, password);
    const payload = { sub: user.id, role: user.role };
    return { accessToken: this.jwt.sign(payload) };
  }
}
