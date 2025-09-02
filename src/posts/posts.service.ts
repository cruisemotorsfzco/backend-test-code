import { Injectable, NotFoundException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreatePostDto, userId: string) {
        try {
            return this.prisma.post.create({
                data: {
                    ...dto,
                    author: { connect: { id: userId } },
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findAll() {
        try {
            return await this.prisma.post.findMany({
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            // ✅ exclude password
                        },
                    },
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findOne(id: string) {
        try {
            const post = await this.prisma.post.findUnique({
                where: { id },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
            return post;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }


    async update(id: string, dto: UpdatePostDto, userId: string) {
        try {
            const post = await this.prisma.post.findUnique({ where: { id } });
            if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

            // ✅ Check if logged-in user is the author
            if (post.userId !== userId) {
                throw new ForbiddenException('You are not the author, you cannot edit this blog');
            }

            return await this.prisma.post.update({
                where: { id },
                data: dto,
            });
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof ForbiddenException
            ) {
                throw error; // ✅ Re-throw as is
            }
            throw new InternalServerErrorException(error.message); // 🔥 Unexpected errors only
        }
    }

    // async remove(id: string, userId: string) {
    //     try {
    //         const post = await this.prisma.post.findUnique({ where: { id } });
    //         if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

    //         // ✅ Check if logged-in user is the author
    //         if (post.userId !== userId) {
    //             throw new ForbiddenException(`You are not allowed to delete this post`);
    //         }

    //         return await this.prisma.post.delete({ where: { id } });
    //     } catch (error) {
    //         throw new InternalServerErrorException(error.message);
    //     }
    // }

    async remove(id: string, userId: string) {
        try {
            const post = await this.prisma.post.findUnique({ where: { id } });
            if (!post) {
                throw new NotFoundException(`Post with ID ${id} not found`);
            }

            if (post.userId !== userId) {
                throw new ForbiddenException(
                    `You are not the author of this blog. You cannot delete it.`
                );
            }

            return await this.prisma.post.delete({ where: { id } });
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof ForbiddenException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
