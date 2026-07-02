import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const dbUrl = process.env.DATABASE_URL;
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        } else {
          return {
            type: 'better-sqlite3',
            database: 'database.sqlite',
            autoLoadEntities: true,
            synchronize: true,
          };
        }
      },
    }),
    AuthModule,
    UsersModule,
    ChatModule,
  ],
})
export class AppModule {}
