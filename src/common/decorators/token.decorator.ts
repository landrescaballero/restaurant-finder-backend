import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the authorization token from the request headers.
 * 
 * This decorator retrieves the token from the `Authorization` header of the incoming HTTP request.
 * The token is expected to be in the format: `Bearer <token>`.
 * 
 * @param data - Optional data passed to the decorator (not used in this implementation).
 * @param ctx - The execution context, which provides access to the HTTP request.
 * @returns The extracted token from the `Authorization` header, or `undefined` if the header is missing or improperly formatted.
 */
export const AuthToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.headers['authorization']?.split(' ')[1];
    },
);

