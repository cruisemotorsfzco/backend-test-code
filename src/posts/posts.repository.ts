import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto';
import { UpdatePostDto } from './dto';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new post in the database
   */
  async create(data: CreatePostDto) {
    return this.prisma.post.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get all posts with their author information
   */
  async findAll() {
    return this.prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find a post by its ID with author information
   */
  async findById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Find all posts by a specific user ID
   */
  async findByUserId(userId: string) {
    return this.prisma.post.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update a post's information
   */
  async update(id: string, data: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete a post from the database
   */
  async delete(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
} 