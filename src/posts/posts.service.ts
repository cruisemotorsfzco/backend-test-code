import { Injectable, NotFoundException, InternalServerErrorException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCommentDto } from './dto/comment-dto';

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

    async addComment(postId: string, dto: CreateCommentDto, userId: string) {
        try {
            // ✅ Check if post exists
            const post = await this.prisma.post.findUnique({ where: { id: postId } });
            if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);

            // ✅ If parentId is provided, check if parent comment exists and belongs to the same post
            let parent: any = null;
            if (dto.parentId) {
                parent = await this.prisma.comment.findUnique({ where: { id: dto.parentId } });
                if (!parent) throw new NotFoundException(`Parent comment with ID ${dto.parentId} not found`);
                if (parent.postId !== postId) {
                    throw new BadRequestException(`Parent comment does not belong to the same post`);
                }
            }

            // ✅ Create comment (nested if parentId is provided)
            return this.prisma.comment.create({
                data: {
                    content: dto.content,
                    post: { connect: { id: postId } },
                    user: { connect: { id: userId } },
                    parent: parent ? { connect: { id: parent.id } } : undefined, // connect parent if exists
                },
            });
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }


    async getComments(
        postId: string,
        options?: { userId?: string; search?: string; page?: number; limit?: number },
    ) {
        const { userId, search, page = 1, limit = 10 } = options || {};

        const where: any = { postId };
        if (userId) where.userId = userId;
        if (search) where.content = { contains: search, mode: 'insensitive' };

        const skip = (page - 1) * limit;

        return this.prisma.comment.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                replies: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
        });
    }

    async removeComment(postId: string, commentId: string, userId: string) {
        try {
            const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
            if (!comment || comment.postId !== postId)
                throw new NotFoundException(`Comment not found for this post`);

            if (comment.userId !== userId)
                throw new ForbiddenException(`You are not the author of this comment`);

            return this.prisma.comment.delete({ where: { id: commentId } });
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
