import { Controller, Get, Query } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';

@Controller('google-drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Get('auth')
  getAuthUrl() {
    return this.googleDriveService.getAuthUrl();
  }

  @Get('callback')
  async handleAuthCallback(@Query('code') code: string) {
    return this.googleDriveService.getToken(code);
  }
}
