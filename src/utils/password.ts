
import * as bcrypt from 'bcryptjs';


export const hashPassword = async (password: string): Promise<string> => {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
}