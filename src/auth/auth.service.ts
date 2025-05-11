import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword } from 'src/utils/password';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Session)
        private sessionRepo: Repository<Session>,
        private usersService: UsersService,
        private jwtService: JwtService,

    ) { }

    /**
     * Validates user credentials.
     * @param username - The username of the user.
     * @param password - The password provided by the user.
     * @returns Promise<User> - A promise that resolves with the user object (without password) if valid credentials are provided.
     * @throws UnauthorizedException if the credentials are incorrect or the user is not found.
     */
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (user && await comparePassword(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException();
    }


    /**
    * Logs in the user and generates a JWT token.
    * @param user - The user object.
    * @returns { access_token: string } - An object containing the JWT token.
    * @throws UnauthorizedException if the user cannot be found or the session cannot be created.
    * The method also updates the session to mark the previous session as inactive and creates a new session.
    */
    async login(user: User): Promise<{ access_token: string; }> {
        const payload = { sub: user.id };
        const token = this.jwtService.sign(payload);

        const decoded: any = this.jwtService.decode(token);

        // Disable the previous session
        await this.sessionRepo.update({ isActive: true, user }, { isActive: false });

        // Create a new session
        const session = this.sessionRepo.create({
            user,
            token,
            expiresAt: new Date(decoded.exp * 1000),
        });

        await this.sessionRepo.save(session);

        return { access_token: token };
    }

    /**
     * Validate session
     * @returns Promise<any> when the session is valid
     */
    async ok(): Promise<any> {
        return {
            message: 'ok',
            status: true,
        }
    }

    /**
     * Logs out the user by invalidating the session.
     * @param token - The JWT token used for logging out.
     * @returns { message: string, status: boolean } - An object indicating the logout status.
     * @throws UnauthorizedException if the session is not found or is expired.
     */
    async logout(token: string): Promise<any> {
        const session = await this.sessionRepo.findOne({
            where: { token },
        });

        if (!session) {
            throw new UnauthorizedException('Session invalid or expired');
        }

        session.isActive = false;
        await this.sessionRepo.save(session);

        return {
            message: 'User logged out successfully',
            status: true,
        }
    }
}
