import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTransactionTable1746934117297 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'transactions',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'method',
                        type: 'varchar',
                        length: '50',
                    },
                    {
                        name: 'query',
                        type: 'text',
                    },
                    {
                        name: 'result',
                        type: 'json',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'transactions',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('transactions');

        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.includes('userId'));
            if (foreignKey) {
                await queryRunner.dropForeignKey('transactions', foreignKey);
            }

            await queryRunner.dropTable('transactions');
        }
    }

}
