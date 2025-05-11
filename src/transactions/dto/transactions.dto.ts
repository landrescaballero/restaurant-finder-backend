import { User } from "src/users/entities/user.entity";

export interface CreateTransactionDto {
    user: User;
    method: TransactionMethod;
    query: string;
    result: any;
}

export enum TransactionMethod {
    COORDINATES = 'coordinates',
    CITY = 'city',
}