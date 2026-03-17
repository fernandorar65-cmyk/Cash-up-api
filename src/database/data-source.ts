import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { InitialSchema1737120000000 } from './migrations/1737120000000-InitialSchema';
import { SeedTestData1737200000000 } from './migrations/1737200000000-SeedTestData';

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
  migrations: [InitialSchema1737120000000, SeedTestData1737200000000],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

console.log(AppDataSource); 
console.log(AppDataSource.options); 
