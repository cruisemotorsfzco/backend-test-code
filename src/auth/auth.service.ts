import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private logger: LoggerService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.log('Validating user credentials', { email });

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      this.logger.log('User validation successful', { userId: user.id, email });
      return result;
    }

    this.logger.error('User validation failed', { email });
    return null;
  }

  async login(loginDto: LoginDto) {
    this.logger.log('User login attempt', { email: loginDto.email });

    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      this.logger.error('Login failed - invalid credentials', { email: loginDto.email });
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    this.logger.log('User login successful', { userId: user.id, email: user.email });

    return {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    this.logger.log('User registration attempt', { email: registerDto.email });

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      this.logger.error('User registration failed - email already exists', { email: registerDto.email });
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        role: (registerDto.role as 'USER' | 'ADMIN') || 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    this.logger.log('User registration successful', { userId: user.id, email: user.email });

    return user;
  }
} 