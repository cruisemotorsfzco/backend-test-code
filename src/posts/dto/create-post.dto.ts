import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Blog Post', description: 'The title of the post' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is the content of my first blog post...', description: 'The content of the post' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The UUID of the user who created the post' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
} 