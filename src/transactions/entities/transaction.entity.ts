import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TransactionMethod } from '../dto/transactions.dto';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'varchar', length: 50 })
    method: TransactionMethod;

    @Column({ type: 'text' })
    query: string;

    @Column({ type: 'json' })
    result: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
