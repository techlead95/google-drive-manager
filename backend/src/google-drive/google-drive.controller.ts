import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessToken } from '../auth/auth.decorator';
import { GoogleApiExceptionFilter } from './google-drive.filter';
import { GoogleDriveResponses } from './google-drive.decorator';
import GetFilesResponse from './dtos/get-files-response';
import UploadFileResponse from './dtos/upload-file-response';

@ApiBearerAuth()
@Controller('v1/google-drive/files')
@ApiTags('google-drive')
@UseFilters(GoogleApiExceptionFilter)
export class GoogleDriveController {
  private readonly logger = new Logger(GoogleDriveController.name);

  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Get()
  @ApiOperation({ summary: 'List files in Google Drive' })
  @ApiQuery({
    name: 'pageToken',
    required: false,
    description: 'Token for fetching the next page of results',
  })
  @ApiResponse({
    status: 200,
    description: 'List of files and token for the next page',
    type: GetFilesResponse,
  })
  @GoogleDriveResponses()
  async getFiles(
    @AccessToken() accessToken: string,
    @Query('pageToken') pageToken?: string,
  ) {
    this.googleDriveService.setAccessToken(accessToken);

    return this.googleDriveService.getFiles(pageToken);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
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
  @ApiOperation({ summary: 'Upload a file to Google Drive' })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: UploadFileResponse,
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
