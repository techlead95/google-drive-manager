import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './auth.module';

jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        generateAuthUrl: jest
          .fn()
          .mockReturnValue('https://mock-google-auth-url.com'),
        getToken: jest.fn().mockResolvedValue({
          tokens: {
            access_token: 'mock_access_token',
            scope: 'mock_scope',
            token_type: 'Bearer',
            expiry_date: 1234567890,
          },
        }),
      })),
    },
  },
}));

describe('AuthController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a Google OAuth2 authorization URL', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/auth/google/authorize')
      .expect(200);

    expect(response.body).toEqual({
      url: 'https://mock-google-auth-url.com',
    });
  });

  it('should return access token and related information', async () => {
    const mockCode = 'test_code';

    const response = await request(app.getHttpServer())
      .get('/v1/auth/google/callback')
      .query({ code: mockCode })
      .expect(200);

    expect(response.body).toEqual({
      accessToken: 'mock_access_token',
      scope: 'mock_scope',
      tokenType: 'Bearer',
      expiryDate: 1234567890,
    });
  });
});
