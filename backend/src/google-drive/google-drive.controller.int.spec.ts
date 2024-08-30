import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GoogleDriveController } from './google-drive.controller';
import { GoogleDriveService } from './google-drive.service';
import { google } from 'googleapis';
import { Readable } from 'stream';

jest.mock('googleapis');

describe('GoogleDriveController (Integration)', () => {
  let app: INestApplication;
  let mockDrive: jest.Mocked<any>;

  beforeEach(async () => {
    mockDrive = {
      files: {
        list: jest.fn(),
        create: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    };

    (google.drive as jest.Mock).mockReturnValue(mockDrive);
    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementation(() => ({
      setCredentials: jest.fn(),
    }));

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [GoogleDriveController],
      providers: [GoogleDriveService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should list files', async () => {
    const mockFiles = [
      { id: '1', name: 'file1' },
      { id: '2', name: 'file2' },
    ];
    mockDrive.files.list.mockResolvedValue({
      data: { files: mockFiles, nextPageToken: null },
    });

    const response = await request(app.getHttpServer())
      .get('/v1/google-drive/files')
      .set('Authorization', 'Bearer valid-access-token')
      .expect(200);

    expect(response.body).toEqual({ files: mockFiles, nextPageToken: null });
    expect(mockDrive.files.list).toHaveBeenCalled();
  });

  it('should upload a file', async () => {
    const mockUploadedFile = { id: '1', name: 'testfile.txt' };
    mockDrive.files.create.mockResolvedValue({ data: mockUploadedFile });

    const response = await request(app.getHttpServer())
      .post('/v1/google-drive/files')
      .set('Authorization', 'Bearer valid-access-token')
      .attach('file', Buffer.from('file content'), 'testfile.txt')
      .expect(201);

    expect(response.body).toEqual(mockUploadedFile);
    expect(mockDrive.files.create).toHaveBeenCalled();
  });

  it('should download a file', async () => {
    const mockFileStream = new Readable();
    mockFileStream.push('mock file content');
    mockFileStream.push(null);

    mockDrive.files.get.mockResolvedValueOnce({
      data: { name: 'testfile.txt', mimeType: 'text/plain' },
    });
    mockDrive.files.get.mockResolvedValueOnce({ data: mockFileStream });

    const response = await request(app.getHttpServer())
      .get('/v1/google-drive/files/1')
      .set('Authorization', 'Bearer valid-access-token')
      .expect(200);

    expect(response.headers['content-type']).toEqual(
      'text/plain; charset=utf-8',
    );
    expect(response.headers['content-disposition']).toContain(
      'attachment; filename="testfile.txt"',
    );
    expect(response.text).toEqual('mock file content');
    expect(mockDrive.files.get).toHaveBeenCalledTimes(2);
  });

  it('should delete a file', async () => {
    mockDrive.files.delete.mockResolvedValue({});

    await request(app.getHttpServer())
      .delete('/v1/google-drive/files/1')
      .set('Authorization', 'Bearer valid-access-token')
      .expect(204);

    expect(mockDrive.files.delete).toHaveBeenCalledWith({ fileId: '1' });
  });
});
