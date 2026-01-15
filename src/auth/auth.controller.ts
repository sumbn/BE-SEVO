import { Controller, Post, Body, Get, UseGuards, Request, Response, UnauthorizedException, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return {
      success: true,
      data: { user },
      meta: { timestamp: new Date().toISOString() }
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không đúng.'
        }
      });
    }
    
    const tokens = await this.authService.login(user);

    return {
      success: true,
      data: tokens,
      meta: { timestamp: new Date().toISOString() }
    };
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(dto.refreshToken);

    return {
      success: true,
      data: tokens,
      meta: { timestamp: new Date().toISOString() }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const profile = await this.authService.getProfile(req.user.userId);
    return {
      success: true,
      data: profile,
      meta: { timestamp: new Date().toISOString() }
    };
  }
}
