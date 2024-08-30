import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  setAccessToken(accessToken: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
    });
  }

  async getFiles(pageToken?: string) {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    const response = await drive.files.list({
      pageSize: 10,
      pageToken,
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
      q: "mimeType != 'application/vnd.google-apps.folder'",
    });

    return response.data;
  }

  async uploadFile(file: Express.Multer.File) {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
    });

    return response.data;
  }

  async downloadFile(fileId: string) {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

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

  async deleteFile(fileId: string) {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    await drive.files.delete({ fileId });
  }
}
