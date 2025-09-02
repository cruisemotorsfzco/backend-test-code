import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'Alice' })
    name: string;

    @ApiProperty({ example: 'alice@example.com' })
    email: string;

    @ApiProperty({ example: 'password123' })
    password: string;
}
