import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { RequestWithUser } from '@/types/request.type';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() req: RequestWithUser) {
    return this.authService.signIn(req.user);
  }
}
