import {
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateUserDto) {
        try {
            // Check if email already exists
            const existing = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (existing) {
                throw new ConflictException('Email already in use');
            }


            const hashedPassword = await bcrypt.hash(dto.password, 10);

            return await this.prisma.user.create({
                data: {
                    ...dto,
                    password: hashedPassword, // store hash
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findAll() {
        try {
            return await this.prisma.user.findMany();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findOne(id: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async update(id: string, dto: UpdateUserDto) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            return await this.prisma.user.update({ where: { id }, data: dto });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async remove(id: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            return await this.prisma.user.delete({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
