import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'Alice Updated', description: 'Updated name' })
    name?: string;

    @ApiPropertyOptional({ example: 'alice.new@example.com', description: 'Updated email' })
    email?: string;

    @ApiPropertyOptional({ example: 'newpassword123', description: 'Updated password' })
    password?: string;
}
