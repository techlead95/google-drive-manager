import { Test, TestingModule } from '@nestjs/testing';
import { GoogleDriveController } from './google-drive.controller';
import { GoogleDriveService } from './google-drive.service';

describe('GoogleDriveController', () => {
  let controller: GoogleDriveController;
  let googleDriveService: jest.Mocked<GoogleDriveService>;

  beforeEach(async () => {
    const mockFileStream = {
      pipe: jest.fn().mockImplementation((res) => {
        res.end('mock file content');
      }),
    };

    googleDriveService = {
      setAccessToken: jest.fn(),
      getFiles: jest.fn().mockResolvedValue({ files: [], nextPageToken: null }),
      uploadFile: jest.fn().mockResolvedValue({ id: '1', name: 'testfile' }),
      downloadFile: jest.fn().mockResolvedValue({
        fileStream: mockFileStream,
        fileName: 'testfile',
        mimeType: 'text/plain',
      }),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleDriveController],
      providers: [
        { provide: GoogleDriveService, useValue: googleDriveService },
      ],
    }).compile();

    controller = module.get<GoogleDriveController>(GoogleDriveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listFiles', () => {
    it('should list files', async () => {
      const result = await controller.getFiles('valid-access-token');
      expect(result).toEqual({ files: [], nextPageToken: null });
      expect(googleDriveService.setAccessToken).toHaveBeenCalledWith(
        'valid-access-token',
      );
      expect(googleDriveService.getFiles).toHaveBeenCalled();
    });
  });

  describe('uploadFile', () => {
    it('should upload a file', async () => {
      const mockFile = {
        originalname: 'testfile.txt',
        buffer: Buffer.from('file content'),
        mimetype: 'text/plain',
      } as Express.Multer.File;

      const result = await controller.uploadFile(
        'valid-access-token',
        mockFile,
      );
      expect(result).toEqual({ id: '1', name: 'testfile' });
      expect(googleDriveService.setAccessToken).toHaveBeenCalledWith(
        'valid-access-token',
      );
      expect(googleDriveService.uploadFile).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('downloadFile', () => {
    it('should download a file', async () => {
      const mockResponse = {
        contentType: jest.fn(),
        attachment: jest.fn(),
        end: jest.fn(),
      } as any;

      await controller.downloadFile('valid-access-token', '1', mockResponse);
      expect(googleDriveService.setAccessToken).toHaveBeenCalledWith(
        'valid-access-token',
      );
      expect(googleDriveService.downloadFile).toHaveBeenCalledWith('1');
      expect(mockResponse.contentType).toHaveBeenCalledWith('text/plain');
      expect(mockResponse.attachment).toHaveBeenCalledWith('testfile');
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      await controller.deleteFile('valid-access-token', '1');
      expect(googleDriveService.setAccessToken).toHaveBeenCalledWith(
        'valid-access-token',
      );
      expect(googleDriveService.deleteFile).toHaveBeenCalledWith('1');
    });
  });
});
