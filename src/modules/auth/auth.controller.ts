import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { RequestWithUser } from '@/types/request.type';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { Public } from '@/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() req: RequestWithUser) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: RequestWithUser) {
    const { user } = req;
    const accessToken = this.authService.generateAccessToken({
      userId: user._id.toString(),
    });
    return { accessToken };
  }
}
