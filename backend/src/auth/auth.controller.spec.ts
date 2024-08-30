import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      getAuthUrl: jest.fn(),
      getToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('googleAuthorize', () => {
    it('should return the Google OAuth2 authorization URL', () => {
      const mockUrl = 'https://accounts.google.com/o/oauth2/auth?...';
      jest.spyOn(authService, 'getAuthUrl').mockReturnValue(mockUrl);

      const result = authController.googleAuthorize();

      expect(result).toEqual({ url: mockUrl });
      expect(authService.getAuthUrl).toHaveBeenCalled();
    });
  });

  describe('googleCallback', () => {
    it('should return access token and related information', async () => {
      const mockCode = 'test_code';
      const mockTokens = {
        access_token: 'test_access_token',
        scope: 'test_scope',
        token_type: 'Bearer',
        expiry_date: 1234567890,
      };

      jest.spyOn(authService, 'getToken').mockResolvedValue(mockTokens);

      const result = await authController.googleCallback(mockCode);

      expect(result).toEqual({
        accessToken: mockTokens.access_token,
        scope: mockTokens.scope,
        tokenType: mockTokens.token_type,
        expiryDate: mockTokens.expiry_date,
      });
      expect(authService.getToken).toHaveBeenCalledWith(mockCode);
    });
  });
});
