// src/auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;

    @ApiProperty({
        example: { id: '123', email: 'user@example.com', role: 'user' },
    })
    user: {
        id: string;
        email: string;
        role: string;
    };
}
