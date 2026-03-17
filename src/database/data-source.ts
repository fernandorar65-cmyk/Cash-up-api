import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SeedRoles1737300000000 } from './migrations/1737300000000-SeedRoles';

dotenv.config();

const useUrl = process.env.DATABASE_URL && !process.env.DB_HOST;

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(useUrl
    ? { url: process.env.DATABASE_URL }
    : {
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'cashup',
      }),
  entities: [],
  migrations: [SeedRoles1737300000000],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
}); 
