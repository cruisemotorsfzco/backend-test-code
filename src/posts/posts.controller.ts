import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { ApiResponseDto } from '../common/dto';
import { POST_MESSAGES } from './constants/post.messages';
import { UuidValidationPipe } from '../common/pipes/uuid-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PostOwnerGuard } from '../auth/guards/post-owner.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid userId or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: any) {
    // Set the userId from the authenticated user
    createPostDto.userId = user.id;
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
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid userId or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - You can only modify your own posts' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  async update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const result = await this.postsService.update(id, updatePostDto);
    return ApiResponseDto.success(result, POST_MESSAGES.POST.UPDATED);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - You can only delete your own posts' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  async remove(@Param('id', UuidValidationPipe) id: string) {
    const result = await this.postsService.remove(id);
    return ApiResponseDto.success(result, POST_MESSAGES.POST.DELETED);
  }
} 