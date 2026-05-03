export interface AppConfig {
  port: number;
  database: { url: string };
  supabase: { jwtSecret: string };
  redis: { host: string; port: number };
}

export default (): AppConfig => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: { url: process.env.DATABASE_URL || '' },
  supabase: { jwtSecret: process.env.SUPABASE_JWT_SECRET || '' },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  }
});