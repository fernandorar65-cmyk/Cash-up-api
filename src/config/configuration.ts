export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/cashup',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
});
