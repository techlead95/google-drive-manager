import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessToken } from 'src/auth/auth.decorator';
import { GoogleApiExceptionFilter } from './google-drive.filter';
import { GoogleDriveResponses } from './google-drive.decorator';

@ApiTags('google-drive')
@ApiBearerAuth()
@Controller('v1/google-drive/files')
@UseFilters(GoogleApiExceptionFilter)
export class GoogleDriveController {
  private readonly logger = new Logger(GoogleDriveController.name);

  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Get()
  @ApiOperation({ summary: 'List files in Google Drive' })
  @ApiResponse({ status: 200, description: 'List of files in Google Drive' })
  @GoogleDriveResponses()
  async listFiles(@AccessToken() accessToken: string) {
    this.googleDriveService.setAccessToken(accessToken);

    return this.googleDriveService.listFiles();
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
  @GoogleDriveResponses()
  async uploadFile(
    @AccessToken() accessToken: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.googleDriveService.setAccessToken(accessToken);

    return this.googleDriveService.uploadFile(file);
  }

  @Get(':fileId')
  @ApiOperation({ summary: 'Download a file from Google Drive' })
  @ApiParam({
    name: 'fileId',
    required: true,
    description: 'ID of the file to download',
  })
  @ApiResponse({ status: 200, description: 'File stream' })
  @GoogleDriveResponses()
  async downloadFile(
    @AccessToken() accessToken: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    this.googleDriveService.setAccessToken(accessToken);

    const { fileStream, fileName, mimeType } =
      await this.googleDriveService.downloadFile(fileId);

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
  @GoogleDriveResponses()
  @HttpCode(204)
  async deleteFile(
    @AccessToken() accessToken: string,
    @Param('fileId') fileId: string,
  ) {
    this.googleDriveService.setAccessToken(accessToken);

    await this.googleDriveService.deleteFile(fileId);

    return { message: 'File deleted successfully' };
  }
}
