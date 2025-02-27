import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: SignUpDto) {
    try {
      const existingUser = await this.prisma.users.count({
        where: { email: data.email?.toLowerCase() },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const createdUser = await this.prisma.users.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email?.toLowerCase(),
          password: hashedPassword,
        },
      });

      const payload = {
        userId: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: payload,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }

      const payload = {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: payload,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async googleLogin({
    firstName,
    lastName,
    email,
    googleId,
    photo,
    accessToken,
    refreshToken,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    googleId: string;
    photo: string;
    accessToken: string;
    refreshToken: string;
  }) {
    try {
      let user = await this.prisma.users.findFirst({
        where: { email: email?.toLowerCase() },
      });

      if (!user) {
        user = await this.prisma.users.create({
          data: {
            firstName,
            lastName,
            email: email?.toLowerCase(),
            verified: true,
            googleId,
            photo,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
          },
        });
      }

      const payload = {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: payload,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}
