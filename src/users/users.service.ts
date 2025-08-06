import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersRepository } from './users.repository';
import { USER_MESSAGES } from './constants/user.messages';
import { LoggerService } from '../logger/logger.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private logger: LoggerService,
  ) { }

  /**
   * Create a new user with hashed password
   */
  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creating new user', { email: createUserDto.email });

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    this.logger.log('User created successfully', { userId: user.id, email: user.email });
    return user;
  }

  /**
   * Get all users from the database
   */
  async findAll() {
    this.logger.log('Fetching all users');

    const users = await this.usersRepository.findAll();

    this.logger.log('Users fetched successfully', { count: users.length });
    return users;
  }

  /**
   * Find a user by ID with error handling
   */
  async findOne(id: string) {
    this.logger.log('Fetching user by ID', { userId: id });

    const user = await this.usersRepository.findById(id);

    if (!user) {
      this.logger.error('User not found', { userId: id });
      throw new NotFoundException(USER_MESSAGES.USER.NOT_FOUND);
    }

    this.logger.log('User fetched successfully', { userId: user.id, email: user.email });
    return user;
  }

  /**
   * Update a user's information with password hashing
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log('Updating user', { userId: id, fields: Object.keys(updateUserDto) });

    const userExists = await this.usersRepository.findById(id);

    if (!userExists) {
      this.logger.error('User not found', { userId: id });
      throw new NotFoundException(USER_MESSAGES.USER.NOT_FOUND);
    }

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      this.logger.log('Password update detected, hashing password', { userId: id });
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.usersRepository.update(id, data);

    this.logger.log('User updated successfully', { userId: user.id, email: user.email });
    return user;
  }

  /**
   * Delete a user from the database
   */
  async remove(id: string) {
    this.logger.log('Deleting user', { userId: id });

    const userExists = await this.usersRepository.findById(id);

    if (!userExists) {
      this.logger.error('User not found', { userId: id });
      throw new NotFoundException(USER_MESSAGES.USER.NOT_FOUND);
    }

    await this.usersRepository.delete(id);

    this.logger.log('User deleted successfully', { userId: id });

    return { id };
  }
} 