import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('google-drive')
@ApiTags('google-drive')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer <access_token>',
})
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Get('auth')
  @ApiOperation({ summary: 'Get Google OAuth2 authorization URL' })
  @ApiResponse({
    status: 200,
    description: 'Returns the Google OAuth2 authorization URL',
    schema: {
      type: 'string',
    },
  })
  getAuthUrl() {
    return this.googleDriveService.getAuthUrl();
  }

  @Get('callback')
  @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'The authorization code returned by Google',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the access token and related information',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
        scope: { type: 'string' },
        token_type: { type: 'string' },
        expiry_date: { type: 'number' },
      },
    },
  })
  @Get('callback')
  async handleAuthCallback(@Query('code') code: string) {
    return this.googleDriveService.getToken(code);
  }

  @Get('files')
  @ApiOperation({ summary: 'List files in Google Drive' })
  @ApiResponse({ status: 200, description: 'List of files in Google Drive' })
  async listFiles(@Query('accessToken') accessToken: string) {
    return this.googleDriveService.listFiles(accessToken);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file to Google Drive' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Query('accessToken') accessToken: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.googleDriveService.uploadFile(accessToken, file);
  }

  @Get('download/:fileId')
  @ApiOperation({ summary: 'Download a file from Google Drive' })
  @ApiParam({
    name: 'fileId',
    required: true,
    description: 'ID of the file to download',
  })
  @ApiResponse({ status: 200, description: 'File stream' })
  async downloadFile(
    @Query('accessToken') accessToken: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const { fileStream, fileName, mimeType } =
      await this.googleDriveService.downloadFile(accessToken, fileId);

    res.contentType(mimeType);
    res.attachment(fileName);

    fileStream.pipe(res);
  }

  @Delete('delete/:fileId')
  @ApiOperation({ summary: 'Delete a file from Google Drive' })
  @ApiParam({
    name: 'fileId',
    required: true,
    description: 'ID of the file to delete',
  })
  @ApiResponse({ status: 204, description: 'File deleted successfully' })
  @HttpCode(204)
  async deleteFile(
    @Query('accessToken') accessToken: string,
    @Param('fileId') fileId: string,
  ) {
    await this.googleDriveService.deleteFile(accessToken, fileId);
    return { message: 'File deleted successfully' };
  }
}
