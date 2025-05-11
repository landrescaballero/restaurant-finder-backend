import { DataSourceOptions } from 'typeorm';
import { EnvironmentConfig } from './config';

export const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: EnvironmentConfig.hostDB,
    port: EnvironmentConfig.portDB,
    username: EnvironmentConfig.usernameDB,
    password: EnvironmentConfig.passwordDB,
    database: EnvironmentConfig.nameDB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/**/*{.ts,.js}'],
    logging: false,
    synchronize: false,
};
