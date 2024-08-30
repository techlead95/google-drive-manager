import { ExecutionContext } from '@nestjs/common';
import { extractAccessToken } from './auth.decorator';

describe('extractAccessToken', () => {
  const createMockExecutionContext = (
    authorizationHeader: string | undefined,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authorizationHeader,
          },
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should return the token when authorization header with Bearer is present', () => {
    const expectedToken = 'token123';
    const authorizationHeader = `Bearer ${expectedToken}`;
    const context = createMockExecutionContext(authorizationHeader);

    const token = extractAccessToken(null, context);

    expect(token).toBe(expectedToken);
  });

  it('should return null when authorization header is missing', () => {
    const context = createMockExecutionContext(undefined);

    const token = extractAccessToken(null, context);

    expect(token).toBeNull();
  });

  it('should return null when authorization header is not using Bearer scheme', () => {
    const authorizationHeader = 'Basic someEncodedString';
    const context = createMockExecutionContext(authorizationHeader);

    const token = extractAccessToken(null, context);

    expect(token).toBeNull();
  });
});
