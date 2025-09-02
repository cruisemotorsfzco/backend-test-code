import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
    @ApiPropertyOptional({ example: 'Updated Title' })
    title?: string;

    @ApiPropertyOptional({ example: 'Updated Content' })
    content?: string;
}
