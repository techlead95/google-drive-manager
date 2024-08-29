import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessToken } from 'src/auth/auth.decorator';

@Controller('v1/google-drive/files')
@ApiTags('google-drive')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer <access_token>',
})
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Get()
  @ApiOperation({ summary: 'List files in Google Drive' })
  @ApiResponse({ status: 200, description: 'List of files in Google Drive' })
  async listFiles(@AccessToken() accessToken: string) {
    return this.googleDriveService.listFiles(accessToken);
  }

  @Post()
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
    @AccessToken() accessToken: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.googleDriveService.uploadFile(accessToken, file);
  }

  @Get(':fileId')
  @ApiOperation({ summary: 'Download a file from Google Drive' })
  @ApiParam({
    name: 'fileId',
    required: true,
    description: 'ID of the file to download',
  })
  @ApiResponse({ status: 200, description: 'File stream' })
  async downloadFile(
    @AccessToken() accessToken: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const { fileStream, fileName, mimeType } =
      await this.googleDriveService.downloadFile(accessToken, fileId);

    res.contentType(mimeType);
    res.attachment(fileName);

    fileStream.pipe(res);
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Delete a file from Google Drive' })
  @ApiParam({
    name: 'fileId',
    required: true,
    description: 'ID of the file to delete',
  })
  @ApiResponse({ status: 204, description: 'File deleted successfully' })
  @HttpCode(204)
  async deleteFile(
    @AccessToken() accessToken: string,
    @Param('fileId') fileId: string,
  ) {
    await this.googleDriveService.deleteFile(accessToken, fileId);
    return { message: 'File deleted successfully' };
  }
}
