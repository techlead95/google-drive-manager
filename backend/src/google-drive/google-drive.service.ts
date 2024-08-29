import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleDriveService {
  async listFiles(accessToken: string) {
    const drive = google.drive({ version: 'v3', auth: accessToken });

    const response = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    });

    return response.data.files;
  }

  async uploadFile(accessToken: string, file: Express.Multer.File) {
    const drive = google.drive({ version: 'v3', auth: accessToken });

    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: file.buffer,
      },
    });

    return response.data;
  }

  async downloadFile(accessToken: string, fileId: string) {
    const drive = google.drive({ version: 'v3', auth: accessToken });

    const metadata = await drive.files.get({
      fileId,
      fields: 'name, mimeType',
    });

    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
    );

    return {
      fileStream: response.data,
      fileName: metadata.data.name,
      mimeType: metadata.data.mimeType,
    };
  }

  async deleteFile(accessToken: string, fileId: string) {
    const drive = google.drive({ version: 'v3', auth: accessToken });

    await drive.files.delete({ fileId });
  }
}
