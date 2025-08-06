import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Updated Blog Post Title', description: 'The title of the post', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Updated content', description: 'The content of the post', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The UUID of the user who created the post', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;
} 