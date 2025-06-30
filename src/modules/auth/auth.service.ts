import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/utils';
import { TokenPayload } from './interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

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
        throw new ConflictException('Email already existed!');
      }

      const hashPassword = await hashPasswordHelper(signUpDTO.password);
      const newUser = await this.userService.create({
        ...signUpDTO,
        username: `${signUpDTO.email.split('@')[0]}${Math.floor(10 + Math.random() * (999 - 10))}`,
        password: hashPassword,
      });
      return newUser;
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
      return { accessToken, refreshToken };
    } catch (error) {}
  }

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      await comparePasswordHelper(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials!!');
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
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
  }
}
