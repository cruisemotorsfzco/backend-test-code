import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { RolesGuard } from 'src/auth/strategy/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/shared/enums/user-roles.enum';
import { CreateCommentDto } from './dto/comment-dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    create(@Body() dto: CreatePostDto, @Req() req: any) {
        const user = req.user as { userId: string };
        return this.postsService.create(dto, user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @Get()
    @ApiOperation({ summary: 'Get all posts (with author)' })
    @ApiResponse({ status: 200, description: 'List of posts with authors' })
    findAll() {
        return this.postsService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Get a post by ID' })
    @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @Patch(':id')
    @ApiOperation({ summary: 'Update a post by ID' })
    @ApiResponse({ status: 200, description: 'Post updated successfully' })
    update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Req() req: any) {
        return this.postsService.update(id, dto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a post by ID' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    remove(@Param('id') id: string, @Req() req: any) {
        return this.postsService.remove(id, req.user.userId);
    }

    // ----------------- Comment Routes -----------------
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(':postId/comments')
    @ApiOperation({ summary: 'Add a comment to a post' })
    @ApiResponse({ status: 201, description: 'Comment added successfully' })
    addComment(
        @Param('postId') postId: string,
        @Body() dto: CreateCommentDto,
        @Req() req: any
    ) {
        return this.postsService.addComment(postId, dto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':postId/comments')
    @ApiOperation({ summary: 'Get all comments for a post (nested)' })
    @ApiResponse({ status: 200, description: 'List of comments with nested replies' })
    @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
    @ApiQuery({ name: 'search', required: false, description: 'Search in comment content' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Comments per page', example: 10 })
    getComments(
        @Param('postId') postId: string,
        @Query('userId') userId?: string,
        @Query('search') search?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.postsService.getComments(postId, { userId, search, page, limit });
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':postId/comments/:commentId')
    @ApiOperation({ summary: 'Delete a comment from a post' })
    @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
    removeComment(
        @Param('postId') postId: string,
        @Param('commentId') commentId: string,
        @Req() req: any
    ) {
        return this.postsService.removeComment(postId, commentId, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @Patch(':id/publish')
    @ApiOperation({ summary: 'Publish a post and create notification' })
    @ApiResponse({ status: 200, description: 'Post published successfully with notification' })
    publish(@Param('id') id: string, @Req() req: any) {
        return this.postsService.publishPost(id, req.user.userId);
    }
}
