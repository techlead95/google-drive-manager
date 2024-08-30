import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';

jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        generateAuthUrl: jest.fn(),
        getToken: jest.fn(),
      })),
    },
  },
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockOAuth2Client: jest.Mocked<OAuth2Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockOAuth2Client = (service as any).oauth2Client;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthUrl', () => {
    it('should call generateAuthUrl with correct parameters', () => {
      service.getAuthUrl();

      expect(mockOAuth2Client.generateAuthUrl).toHaveBeenCalledWith({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive'],
      });
    });

    it('should return the generated auth URL', () => {
      const mockUrl = 'https://example.com/auth';
      (mockOAuth2Client.generateAuthUrl as jest.Mock).mockReturnValue(mockUrl);

      const result = service.getAuthUrl();

      expect(result).toBe(mockUrl);
    });
  });

  describe('getToken', () => {
    it('should call getToken with the provided code', async () => {
      const mockCode = 'test-code';
      const mockTokens = { access_token: 'test-token' };
      (mockOAuth2Client.getToken as jest.Mock).mockResolvedValue({
        tokens: mockTokens,
      });

      await service.getToken(mockCode);

      expect(mockOAuth2Client.getToken).toHaveBeenCalledWith(mockCode);
    });

    it('should return the tokens', async () => {
      const mockTokens = { access_token: 'test-token' };
      (mockOAuth2Client.getToken as jest.Mock).mockResolvedValue({
        tokens: mockTokens,
      });

      const result = await service.getToken('test-code');

      expect(result).toEqual(mockTokens);
    });
  });
});
