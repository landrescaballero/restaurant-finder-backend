import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentConfig } from 'src/config/config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

/**
 * JwtStrategy is a custom strategy for handling JWT-based authentication
 * using the Passport library. It validates the JWT token and ensures the
 * associated user and session are valid.
 *
 * @class
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * Constructs a new JwtStrategy instance.
     *
     * @param {Repository<User>} userRepository - The repository for accessing user data.
     * @param {Repository<Session>} sessionRepo - The repository for accessing session data.
     */
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Session)
        private sessionRepo: Repository<Session>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: EnvironmentConfig.jwtSecret,
            passReqToCallback: true,
        });
    }

    /**
     * Validates the JWT token and ensures the user and session are valid.
     *
     * @param {any} req - The HTTP request object.
     * @param {any} payload - The decoded JWT payload.
     * @returns {Promise<any>} The validated user object.
     * @throws {UnauthorizedException} If the token is not found or the session is invalid/expired.
     * @throws {NotFoundException} If the user is not found.
     */
    async validate(req: any, payload: any): Promise<any> {
        const userId = payload.sub;

        // Extract the token from the request
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        // Find the user by ID
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'username', 'firstName', 'lastName'],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Find the active session associated with the token
        const session = await this.sessionRepo.findOne({
            where: { token, isActive: true },
            relations: ['user'],
        });

        if (!session) {
            throw new UnauthorizedException('Session invalid or expired');
        }

        return { ...user };
    }
}
