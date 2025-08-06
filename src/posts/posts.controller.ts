import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { ApiResponseDto } from '../common/dto';
import { POST_MESSAGES } from './constants/post.messages';
import { UuidValidationPipe } from '../common/pipes/uuid-validation.pipe';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid userId or validation error' })
  async create(@Body() createPostDto: CreatePostDto) {
    const result = await this.postsService.create(createPostDto);
    return ApiResponseDto.success(result, POST_MESSAGES.POST.CREATED);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with their authors' })
  @ApiResponse({ status: 200, description: 'List of all posts with author information' })
  async findAll() {
    const result = await this.postsService.findAll();
    return ApiResponseDto.success(result, POST_MESSAGES.POST.LIST_FETCHED);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID with author information' })
  @ApiResponse({ status: 200, description: 'Post found with author' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id', UuidValidationPipe) id: string) {
    const result = await this.postsService.findOne(id);
    return ApiResponseDto.success(result, POST_MESSAGES.POST.FETCHED);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid userId or validation error' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const result = await this.postsService.update(id, updatePostDto);
    return ApiResponseDto.success(result, POST_MESSAGES.POST.UPDATED);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id', UuidValidationPipe) id: string) {
    const result = await this.postsService.remove(id);
    return ApiResponseDto.success(result, POST_MESSAGES.POST.DELETED);
  }
} 