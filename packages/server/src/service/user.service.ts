import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    // Create user
    async createUser(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<User> {
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password
            },
        });
    }

    // Query user by ID
    async findUserById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    // Query user by email
    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    // Update user information
    async updateUser(id: string, data: { name?: string; email?: string }): Promise<User | null> {
        return this.prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
            },
        });
    }

    // Delete user
    async deleteUser(id: string): Promise<User | null> {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    // Search users
    async searchUsers(keyword: string): Promise<Partial<User>[]> {
        if (!keyword || keyword.trim().length < 2) {
            return []; // Require at least 2 characters
        }

        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { email: { contains: keyword, mode: 'insensitive' } }
                ]
            },
            take: 10, // Limit result count
            select: {
                id: true,
                name: true,
                email: true,
                // Do not return password
            }
        });
        
        return users;
    }

    async validateUser(nameOrEmail: string, password: string): Promise<User | null> {
        // First try to find user by email
        let user = await this.prisma.user.findFirst({
            where: { email: nameOrEmail },
        });

        // If not found by email, try by username
        if (!user) {
            user = await this.prisma.user.findFirst({
                where: { name: nameOrEmail },
            });
        }
        // If user is found and password matches
        if (user) {
            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                return user;
            }
        }

        // Validation failed
        return null;
    }
}
