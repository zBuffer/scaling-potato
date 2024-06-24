import { dataSource } from './env';
import { DataSource } from 'typeorm';

export = new DataSource({
  ...dataSource,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
} as any);
