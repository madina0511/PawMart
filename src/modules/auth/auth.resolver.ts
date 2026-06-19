import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthType } from './dto/auth.type';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return 'PawMart API is running 🐾';
  }

  @Mutation(() => AuthType)
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: { res: Response },
  ): Promise<AuthType> {
    const result = await this.authService.register(input);
    this.setTokenCookies(ctx.res, result.accessToken, result.refreshToken);
    return result;
  }

  @Mutation(() => AuthType)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: { res: Response },
  ): Promise<AuthType> {
    const result = await this.authService.login(input);
    this.setTokenCookies(ctx.res, result.accessToken, result.refreshToken);
    return result;
  }

  @Mutation(() => AuthType)
  async refreshTokens(
    @Args('refreshToken') refreshToken: string,
    @Context() ctx: { res: Response },
  ): Promise<AuthType> {
    const result = await this.authService.refreshTokens(refreshToken);
    this.setTokenCookies(ctx.res, result.accessToken, result.refreshToken);
    return result;
  }

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 kun
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
    });
  }
}
