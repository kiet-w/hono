export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: { url: process.env.DATABASE_URL },
  supabase: { jwtSecret: process.env.SUPABASE_JWT_SECRET },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  }
});
