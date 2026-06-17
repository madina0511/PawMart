import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthType } from './dto/auth.type';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return 'PawMart API is running 🐾';
  }

  @Mutation(() => AuthType)
  async register(@Args('input') input: RegisterInput): Promise<AuthType> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthType)
  async login(@Args('input') input: LoginInput): Promise<AuthType> {
    return this.authService.login(input);
  }

  @Mutation(() => AuthType)
  async refreshTokens(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthType> {
    return this.authService.refreshTokens(refreshToken);
  }
}
