import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthType } from './dto/auth.type';
import { getErrorMessage } from '../../common/utils/error.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
    return { accessToken, refreshToken };
  }

  async register(input: RegisterInput): Promise<AuthType> {
    this.logger.log(`Registering user: ${input.email}`);
    try {
      const existing = await this.usersService.findByEmail(input.email);
      if (existing) throw new ConflictException('Email already in use');

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await this.usersService.create({
        ...input,
        password: hashedPassword,
      });

      const { accessToken, refreshToken } = this.generateTokens(
        user._id.toString(),
        user.role,
      );
      this.logger.log(`User registered: ${user._id}`);
      return { accessToken, refreshToken, user: user as any };
    } catch (error) {
      this.logger.error(`Failed to register: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async login(input: LoginInput): Promise<AuthType> {
    this.logger.log(`Login attempt: ${input.email}`);
    try {
      const user = await this.usersService.findByEmail(input.email);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isMatch = await bcrypt.compare(input.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      const { accessToken, refreshToken } = this.generateTokens(
        user._id.toString(),
        user.role,
      );
      this.logger.log(`User logged in: ${user._id}`);
      return { accessToken, refreshToken, user: user as any };
    } catch (error) {
      this.logger.error(`Failed to login: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async refreshTokens(token: string): Promise<AuthType> {
    this.logger.log('Refreshing tokens');
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      const { accessToken, refreshToken } = this.generateTokens(
        user._id.toString(),
        user.role,
      );
      return { accessToken, refreshToken, user: user as any };
    } catch (error) {
      this.logger.error(`Failed to refresh tokens: ${getErrorMessage(error)}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
