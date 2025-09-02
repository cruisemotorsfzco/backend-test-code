import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { RolesGuard } from 'src/auth/strategy/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/shared/enums/user-roles.enum';

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
}
