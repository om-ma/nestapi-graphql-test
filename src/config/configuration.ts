interface JwtConfig {
  secret: string;
  expiresIn: string;
}

interface DatabaseConfig {
  url: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwt: JwtConfig;
  database: DatabaseConfig;
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/books_db',
  },
});
