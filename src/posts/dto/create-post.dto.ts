import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ example: 'My First Post' })
    title: string;

    @ApiProperty({ example: 'This is my post content' })
    content?: string;

    @ApiProperty({ example: 'a3e3c7c9-7c9d-4a47-92f3-5f3a8c6c9e7b', description: 'UUID of the user' })
    userId: string;
}
