import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';

@Injectable()
export class UsersService {
  // En producción esto sería una BD real (PostgreSQL, MongoDB, etc.)
  private users: User[] = [];
  private idCounter = 1;

  async create(username: string, password: string): Promise<Omit<User, 'password'>> {
    const exists = await this.findOne(username);
    if (exists) throw new ConflictException('El usuario ya existe');

    const hash = await bcrypt.hash(password, 10);
    const user: User = { id: this.idCounter++, username, password: hash };
    this.users.push(user);
    return { id: user.id, username: user.username };
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }
}
