import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const testUsername = 'prueba';
    const exists = await this.findOne(testUsername);
    if (!exists) {
      const hash = await bcrypt.hash('prueba123', 10);
      const user = this.usersRepository.create({
        username: testUsername,
        password: hash,
      });
      await this.usersRepository.save(user);
      console.log(
        `[SEEDER] Usuario de prueba creado: Usuario: '${testUsername}' | Contraseña: 'prueba123'`,
      );
    } else {
      console.log(`[SEEDER] El usuario de prueba '${testUsername}' ya existe.`);
    }
  }

  async create(
    username: string,
    password: string,
    extra?: { fullName?: string; email?: string; birthDate?: string },
  ): Promise<Omit<User, 'password'>> {
    const normalizedUsername = username.trim().toLowerCase();
    const exists = await this.findOne(normalizedUsername);
    if (exists) throw new ConflictException('El usuario ya existe');

    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username: normalizedUsername,
      password: hash,
      fullName: extra?.fullName,
      email: extra?.email,
      birthDate: extra?.birthDate,
    });
    const savedUser = await this.usersRepository.save(user);
    return { id: savedUser.id, username: savedUser.username };
  }

  async findOne(username: string): Promise<User | null> {
    const normalizedUsername = username.trim().toLowerCase();
    return this.usersRepository.findOneBy({ username: normalizedUsername });
  }
}
