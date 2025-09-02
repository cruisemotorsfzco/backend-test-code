import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreatePostDto) {
        try {
            return await this.prisma.post.create({ data: dto });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findAll() {
        try {
            return await this.prisma.post.findMany({
                include: { author: true }, // ✅ include user
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findOne(id: string) {
        try {
            const post = await this.prisma.post.findUnique({
                where: { id },
                include: { author: true },
            });
            if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
            return post;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async update(id: string, dto: UpdatePostDto) {
        try {
            const post = await this.prisma.post.findUnique({ where: { id } });
            if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
            return await this.prisma.post.update({ where: { id }, data: dto });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async remove(id: string) {
        try {
            const post = await this.prisma.post.findUnique({ where: { id } });
            if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
            return await this.prisma.post.delete({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
