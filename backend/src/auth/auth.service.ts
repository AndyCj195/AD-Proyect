import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    username: string,
    password: string,
    extra?: { fullName?: string; email?: string; birthDate?: string },
  ) {
    const user = await this.usersService.create(username, password, extra);
    const token = this.jwtService.sign({ sub: user.id, username: user.username });
    return { user, access_token: token };
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Contraseña incorrecta');
    const token = this.jwtService.sign({ sub: user.id, username: user.username });
    return { access_token: token, username: user.username };
  }
}
