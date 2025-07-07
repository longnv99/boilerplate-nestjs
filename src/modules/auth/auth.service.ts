import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { compareContent, hashContent } from '@/helpers/utils';
import { TokenPayload } from './interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { ERROR_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDTO: SignUpDTO) {
    try {
      const existedUser = await this.userService.findOneByCondition({
        email: signUpDTO.email,
      });

      if (existedUser) {
        throw new ConflictException({
          errorCode: ERROR_DICTIONARY.EMAIL_ALREADY_EXISTS,
          message: 'Email already exists',
        });
      }

      const hashPassword = await hashContent(signUpDTO.password);
      const newUser = await this.userService.create({
        ...signUpDTO,
        username: `${signUpDTO.email.split('@')[0]}${Math.floor(10 + Math.random() * (999 - 10))}`,
        password: hashPassword,
      });

      const accessToken = this.generateAccessToken({
        userId: newUser._id.toString(),
      });
      const refreshToken = this.generateRefreshToken({
        userId: newUser._id.toString(),
      });

      await this.storeRefreshToken(newUser._id.toString(), refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: User) {
    try {
      const accessToken = this.generateAccessToken({
        userId: user._id.toString(),
      });
      const refreshToken = this.generateRefreshToken({
        userId: user._id.toString(),
      });

      await this.storeRefreshToken(user._id.toString(), refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {}
  }

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      await compareContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException({
        errorCode: ERROR_DICTIONARY.WRONG_CREDENTIALS,
        message: 'Email or Password incorrect',
      });
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    try {
      const hashToken = await hashContent(token);
      await this.userService.setCurrentRefreshToken(userId, hashToken);
    } catch (error) {}
  }

  async getUserIfRefreshTokenMatched(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    try {
      const user = await this.userService.findOneByCondition({ _id: userId });
      if (!user) {
        throw new UnauthorizedException();
      }

      await compareContent(refreshToken, user.currentRefreshToken);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
