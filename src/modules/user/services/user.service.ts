import { Injectable, Logger } from '@nestjs/common';
import { JwtDto } from 'src/common/dtos/jwt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: JwtDto) {
    try {
      return await this.prisma.users.findUniqueOrThrow({
        where: {
          id: user.userId,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          photo: true,
          googleId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}
