import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto';
import { User } from '../user/schemas/user.schema';
import { CreateUserDto } from '../user/dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const createUserDto: CreateUserDto = {
      email: registerDto.email,
      name: registerDto.name,
      password: registerDto.password,
    };

    const user = await this.userService.create(createUserDto);
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.validatePassword(
      loginDto.password,
      user.password as string,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret') || 'default-refresh-secret',
      });

      const user = await this.userService.findOne(payload.sub);
      if (!user || !(user as any).refreshTokens?.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Remove old refresh token
      await this.userService.removeRefreshToken(payload.sub, refreshToken);

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.userService.removeRefreshToken(userId, refreshToken);
  }

  private generateTokens(user: any): AuthResponseDto {
    const payload = {
      sub: user._id || user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'default-secret',
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '7d' as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret') || 'default-refresh-secret',
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '30d' as any,
    });

    // Save refresh token to user
    this.userService.addRefreshToken(user._id || user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '7d',
    };
  }
}
