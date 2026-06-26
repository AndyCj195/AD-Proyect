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
      console.log(`[SEEDER] Usuario de prueba creado: Usuario: '${testUsername}' | Contraseña: 'prueba123'`);
    } else {
      console.log(`[SEEDER] El usuario de prueba '${testUsername}' ya existe.`);
    }
  }

  async create(username: string, password: string): Promise<Omit<User, 'password'>> {
    const exists = await this.findOne(username);
    if (exists) throw new ConflictException('El usuario ya existe');

    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hash });
    const savedUser = await this.usersRepository.save(user);
    return { id: savedUser.id, username: savedUser.username };
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }
}


