import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { InitialSchema1737120000000 } from './migrations/1737120000000-InitialSchema';

dotenv.config();

const useUrl = process.env.DATABASE_URL && !process.env.DB_HOST;

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(useUrl
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? '123456789',
        database: process.env.DB_NAME ?? 'cash-up',
      }),
  entities: [],
  migrations: [InitialSchema1737120000000],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
