import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import GoogleAuthorizeResponse from './dtos/google-authorize-response';
import GoogleCallbackResponse from './dtos/google-callback-response';

@Controller('v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/authorize')
  @ApiOperation({ summary: 'Get Google OAuth2 authorization URL' })
  @ApiResponse({
    status: 200,
    description: 'Returns the Google OAuth2 authorization URL',
    type: GoogleAuthorizeResponse,
  })
  googleAuthorize(): GoogleAuthorizeResponse {
    const url = this.authService.getAuthUrl();

    return { url };
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'The authorization code returned by Google',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the access token and related information',
    type: GoogleCallbackResponse,
  })
  @Get('callback')
  async googleCallback(
    @Query('code') code: string,
  ): Promise<GoogleCallbackResponse> {
    const tokens = await this.authService.getToken(code);

    return {
      accessToken: tokens.access_token,
      scope: tokens.scope,
      tokenType: tokens.token_type,
      expiryDate: tokens.expiry_date,
    };
  }
}
