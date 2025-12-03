import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { Employee } from '../modules/employees/entities/employee.entity';
import { InitialSchema1764790816241 } from '../database/migrations/1764790816241-InitialSchema';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [User, Employee],
  migrations: [InitialSchema1764790816241],
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
