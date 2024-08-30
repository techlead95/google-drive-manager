import { Test, TestingModule } from '@nestjs/testing';
import { GoogleDriveService } from './google-drive.service';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { Readable } from 'stream';

jest.mock('google-auth-library');
jest.mock('googleapis');

describe('GoogleDriveService', () => {
  let service: GoogleDriveService;
  let mockOAuth2Client: jest.Mocked<OAuth2Client>;
  let mockDrive: jest.Mocked<any>;

  beforeEach(async () => {
    mockOAuth2Client = {
      setCredentials: jest.fn(),
    } as any;

    mockDrive = {
      files: {
        list: jest.fn(),
        create: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    };

    (google.auth.OAuth2 as unknown as jest.Mock).mockReturnValue(
      mockOAuth2Client,
    );
    (google.drive as jest.Mock).mockReturnValue(mockDrive);

    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleDriveService],
    }).compile();

    service = module.get<GoogleDriveService>(GoogleDriveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setAccessToken', () => {
    it('should set the access token', () => {
      const accessToken = 'test-token';
      service.setAccessToken(accessToken);
      expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith({
        access_token: accessToken,
      });
    });
  });

  describe('getFiles', () => {
    it('should return files', async () => {
      const mockResponse = { data: { files: [] } };
      mockDrive.files.list.mockResolvedValue(mockResponse);

      const result = await service.getFiles();
      expect(result).toEqual(mockResponse.data);
      expect(mockDrive.files.list).toHaveBeenCalled();
    });
  });

  describe('uploadFile', () => {
    it('should upload a file', async () => {
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('test'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File;

      const mockResponse = { data: { id: 'test-id' } };
      mockDrive.files.create.mockResolvedValue(mockResponse);

      const result = await service.uploadFile(mockFile);
      expect(result).toEqual(mockResponse.data);
      expect(mockDrive.files.create).toHaveBeenCalled();
    });
  });

  describe('downloadFile', () => {
    it('should download a file', async () => {
      const fileId = 'test-id';
      const mockMetadata = {
        data: { name: 'test.txt', mimeType: 'text/plain' },
      };
      const mockFileStream = new Readable();

      mockDrive.files.get.mockResolvedValueOnce(mockMetadata);
      mockDrive.files.get.mockResolvedValueOnce({ data: mockFileStream });

      const result = await service.downloadFile(fileId);
      expect(result).toEqual({
        fileStream: mockFileStream,
        fileName: 'test.txt',
        mimeType: 'text/plain',
      });
      expect(mockDrive.files.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      const fileId = 'test-id';
      await service.deleteFile(fileId);
      expect(mockDrive.files.delete).toHaveBeenCalledWith({ fileId });
    });
  });
});
