import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const postId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin can modify any post
    if (user.role === 'ADMIN') {
      return true;
    }

    // Check if post exists and belongs to the user
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    if (post.userId !== user.id) {
      throw new ForbiddenException('You can only modify your own posts');
    }

    return true;
  }
} 