import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthService, ITokenReturnBody } from './auth.service';
import { LoginPayload } from './payload/login.payload';
import { RegisterPayload } from './payload/register.payload';
import { ProfileService } from '../profile/profile.service';

/**
 * Authentication Controller
 */
@ApiUseTags('authentication')
@Controller('api/auth')
export class AuthController {
  /**
   * Constructor
   * @param {AuthService} authService authentication service
   * @param {ProfileService} profileService profile service
   */
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Login route to validate and create tokens for users
   * @param {LoginPayload} payload the login dto
   */
  @Post('login')
  @ApiResponse({ status: 201, description: 'Login Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginPayload): Promise<ITokenReturnBody> {
    const profile = await this.authService.validateUser(payload);
    return await this.authService.createToken(profile);
  }

  /**
   * Authentication route to register
   * @param {RegisterPayload} payload the registration dto
   */
  @Post('register')
  @ApiResponse({ status: 201, description: 'Registration Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() payload: RegisterPayload) {
    const profile = await this.profileService.create(payload);
    return await this.authService.createToken(profile);
  }
}
