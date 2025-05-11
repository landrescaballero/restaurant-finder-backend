import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract user information from the request object.
 * 
 * This decorator can be used in a controller method to access the user object
 * attached to the request. Optionally, a specific property of the user object
 * can be retrieved by providing the property name as the `data` argument.
 * 
 * @param data - The optional property name of the user object to retrieve.
 *               If not provided, the entire user object is returned.
 * @param ctx - The execution context, which provides access to the HTTP request.
 * 
 * @returns The user object or a specific property of the user object if `data` is provided.
 * 
 * @example
 * // Retrieve the entire user object
 * @Get()
 * someMethod(@User() user: any) {
 *   console.log(user);
 * }
 * 
 * @example
 * // Retrieve a specific property of the user object
 * @Get()
 * someMethod(@User('email') email: string) {
 *   console.log(email);
 * }
 */
export const User = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const user = request.user;

        return data ? user?.[data] : user;
    },
);
