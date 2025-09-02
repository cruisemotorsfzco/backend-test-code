import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ description: 'Comment text' })
    content: string;

    @ApiProperty({ description: 'Optional parent comment ID', required: false })
    parentId?: string;
}
