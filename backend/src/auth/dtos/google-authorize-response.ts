import { ApiProperty } from '@nestjs/swagger';

export default class GoogleAuthorizeResponse {
  @ApiProperty({
    description:
      "The URL to redirect the user to Google's OAuth2 consent screen",
    example:
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&scope=...',
  })
  url: string;
}
