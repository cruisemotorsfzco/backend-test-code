import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';
import { RolesGuard } from 'src/auth/strategy/roles.guard';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@Module({
  providers: [UsersService, PrismaService],
  controllers: [UsersController]
})
export class UsersModule { }
