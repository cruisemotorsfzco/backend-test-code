import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    create(@Body() dto: CreatePostDto) {
        return this.postsService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOperation({ summary: 'Get all posts (with author)' })
    @ApiResponse({ status: 200, description: 'List of posts with authors' })
    findAll() {
        return this.postsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Get a post by ID' })
    @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    @ApiOperation({ summary: 'Update a post by ID' })
    @ApiResponse({ status: 200, description: 'Post updated successfully' })
    update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
        return this.postsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a post by ID' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}
