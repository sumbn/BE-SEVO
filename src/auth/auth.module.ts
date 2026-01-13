import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { PrismaTokenRepository } from './repositories/prisma-token.repository';
import { TOKEN_REPOSITORY } from './interfaces/token-repository.interface';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sevo-auth-secret-2026',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    {
      provide: TOKEN_REPOSITORY,
      useClass: PrismaTokenRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
