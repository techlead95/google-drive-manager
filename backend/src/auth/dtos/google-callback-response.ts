import { ApiProperty } from '@nestjs/swagger';

export default class GoogleCallbackResponse {
  @ApiProperty({
    description: 'Access token for Google services',
    example: 'ya29.a0Af...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Refresh token to obtain new access tokens',
    example: '1//0g...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Scope of access granted',
    example: 'https://www.googleapis.com/auth/drive',
  })
  scope: string;

  @ApiProperty({
    description: 'Type of token returned (typically bearer)',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description:
      'The expiry time of the access token as milliseconds since epoch',
    example: 1633001013000,
  })
  expiry_date: number;
}
