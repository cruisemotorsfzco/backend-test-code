import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostsRepository } from './posts.repository';
import { POST_MESSAGES } from './constants/post.messages';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private logger: LoggerService,
    private prisma: PrismaService,
  ) {}

  /**
   * Create a new post in the database
   */
  async create(createPostDto: CreatePostDto) {
    this.logger.log('Creating new post', { 
      title: createPostDto.title, 
      userId: createPostDto.userId 
    });

    // Check if user exists before creating post
    const user = await this.prisma.user.findUnique({
      where: { id: createPostDto.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      this.logger.error('Invalid userId provided for post creation', { 
        userId: createPostDto.userId 
      });
      throw new BadRequestException(POST_MESSAGES.ERROR.USER_NOT_FOUND);
    }
    
    const post = await this.postsRepository.create(createPostDto);
    
    this.logger.log('Post created successfully', { 
      postId: post.id, 
      title: post.title, 
      userId: post.userId 
    });
    return post;
  }

  /**
   * Get all posts with their author information
   */
  async findAll() {
    this.logger.log('Fetching all posts');
    
    const posts = await this.postsRepository.findAll();
    
    this.logger.log('Posts fetched successfully', { count: posts.length });
    return posts;
  }

  /**
   * Find a post by ID with error handling
   */
  async findOne(id: string) {
    this.logger.log('Fetching post by ID', { postId: id });
    
    const post = await this.postsRepository.findById(id);

    if (!post) {
      this.logger.error('Post not found', { postId: id });
      throw new NotFoundException(POST_MESSAGES.POST.NOT_FOUND);
    }

    this.logger.log('Post fetched successfully', { 
      postId: post.id, 
      title: post.title, 
      userId: post.userId 
    });
    return post;
  }

  /**
   * Update a post's information
   */
  async update(id: string, updatePostDto: UpdatePostDto) {
    this.logger.log('Updating post', { 
      postId: id, 
      fields: Object.keys(updatePostDto) 
    });

    // If userId is being updated, validate it exists
    if (updatePostDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updatePostDto.userId },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        this.logger.error('Invalid userId provided for post update', { 
          userId: updatePostDto.userId 
        });
        throw new BadRequestException(POST_MESSAGES.ERROR.USER_NOT_FOUND);
      }

      this.logger.log('User validation passed for update', { 
        userId: user.id, 
        userName: user.name 
      });
    }
    
    const post = await this.postsRepository.update(id, updatePostDto);
    
    this.logger.log('Post updated successfully', { 
      postId: post.id, 
      title: post.title, 
      userId: post.userId 
    });
    return post;
  }

  /**
   * Delete a post from the database
   */
  async remove(id: string) {
    this.logger.log('Deleting post', { postId: id });
    
    await this.postsRepository.delete(id);
    
    this.logger.log('Post deleted successfully', { postId: id });
    return { message: POST_MESSAGES.POST.DELETED };
  }
} 