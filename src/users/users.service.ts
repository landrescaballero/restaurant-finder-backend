import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/users.dto';
import { hashPassword } from 'src/utils/password';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    /**
     * Registers a new user.
     * @param body - The data for the new user (username, password, firstName, lastName).
     * @returns A promise that resolves with an object containing the user data (excluding the password), a success message, and status.
     * @throws ConflictException if the username is already taken.
     * @throws InternalServerErrorException if the user registration fails.
     */
    async registerUser(body: CreateUserDto): Promise<any> {
        const { username, password, firstName, lastName } = body;

        // Check if the username is already used
        // If the user already used, throw a ConflictException
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new ConflictException(`Username ${username} is already used`);
        }

        // Hash the password before saving it to the database
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const user = new User();
        user.password = hashedPassword;
        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;

        // Save the user to the database
        // If the user registration fails, throw an InternalServerErrorException
        const userSaved = await this.userRepository.save(user);
        if (!userSaved) {
            throw new InternalServerErrorException('User registration failed');
        }

        // Remove the password from the user object before returning it
        const { password: passwordUser, ...data } = userSaved;

        return {
            data: data,
            message: 'User registered successfully',
            status: true,
        }
    }

    /**
      * Finds a user by their username.
      * @param username - The username of the user to find.
      * @returns A promise that resolves with the user if found, or null if the user does not exist.
      */
    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

}
