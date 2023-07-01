import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Key } from 'src/entities/Key.entity';
import { Manager } from 'src/entities/Manager.entity';
import { Organization } from 'src/entities/Organization.entity';
import { Session } from 'src/entities/Session.entity';

config();

export const AppPort = 8000;

export const DatabaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432, //3306 for sql 5432 for postgres
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_NAME,
    entities: [Manager, Organization, Key, Session],
    synchronize: true,
    autoLoadEntities: true,
};

export const BullConfig = {
    redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
    },
};

export const ItemPerPage = {
    Organization: 7,
    Session: 7,
    Manager: 7,
};

export const ExpiryTime = {
    Render: 25,
    Mint: 300,
};

export const ORBIS_PROJECT_ID =
    'kjzl6cwe1jw14acwxvbuqtiteuvkrtnlwfd7uaoou01le75qd5kdyhqcsmxey5i';
export const ORBIS_ISSUER = 'chatrooms';
export const ORBIS_NAME = 'Chatrooms';
export const ORBIS_CREDENTIAL = 'access-controller';
export const verificationMessage =
    'Sign this message to access chatroom features';
