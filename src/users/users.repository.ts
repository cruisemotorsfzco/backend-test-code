import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { UpdateUserDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all users from the database
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find a user by their ID
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find a user by their email address
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update a user's information
   */
  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Delete a user from the database
   */
  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
} 