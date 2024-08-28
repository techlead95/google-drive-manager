import { Injectable, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class GoogleDriveService {
  private oauth2Client: OAuth2Client;
  private readonly logger = new Logger(GoogleDriveService.name);

  constructor() {
    this.logger.log('client', process.env.GOOGLE_CLIENT_ID);
    this.logger.log('redirect', process.env.GOOGLE_REDIRECT_URI);

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive'],
    });
  }

  async getToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }
}
