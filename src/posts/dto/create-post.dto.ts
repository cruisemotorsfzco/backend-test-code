import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ example: 'My First Post' })
    title: string;

    @ApiProperty({ example: 'This is my post content' })
    content?: string;
}
