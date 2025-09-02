// src/auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({
        status: 200,
        description: 'User logged in successfully',
        type: LoginResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials'
    })
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password
        );

        if (!user) throw new UnauthorizedException('Invalid credentials');

        return this.authService.login(user);
    }
}
