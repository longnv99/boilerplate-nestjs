import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { RequestWithUser } from '@/types/request.type';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { Public } from '@/decorators/auth.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'yourStrongPassword123',
        },
      },
      required: ['email', 'password'],
    },
  })
  @Post('sign-in')
  async signIn(@Req() req: RequestWithUser) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshTokenGuard)
  @ApiOperation({
    summary:
      'Use the Refresh Token (sent in the Authorization header) to get a new Access Token.',
  })
  @Post('refresh-token')
  async refreshToken(@Req() req: RequestWithUser) {
    const { user } = req;
    const accessToken = this.authService.generateAccessToken({
      userId: user._id.toString(),
    });
    return { accessToken };
  }
}
