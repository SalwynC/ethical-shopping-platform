import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export default async function globalSetup() {
  const cwd = path.resolve(__dirname, '..');
  // Ensure docker-compose test DB is up
  try {
    execSync('docker compose -f docker-compose.test.yml up -d', { cwd, stdio: 'inherit' });
  } catch (e) {
    console.warn('Failed to start docker-compose services (is Docker running?)', e.message);
  }

  // Wait a bit for DB to be ready (mapped to host 5433 by docker-compose.test.yml)
  try {
    execSync('npx wait-on tcp:5433 --timeout 300000', { cwd, stdio: 'inherit' });
  } catch (err) {
    console.warn('Timed out waiting for tcp:5433 - continuing (ensure Docker is running)');
  }

  // Ensure a .env.test exists with DATABASE_URL for tests to pick up
  const envPath = path.join(cwd, '.env.test');
  const defaultDatabaseUrl = 'DATABASE_URL=postgresql://test:test@localhost:5433/testdb?schema=public';
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, defaultDatabaseUrl);
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5433/testdb?schema=public';
  } else {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split(/\r?\n/).forEach((line) => {
      if (!line || line.startsWith('#')) return;
      const [k, v] = line.split('=');
      if (k && v) process.env[k] = v;
    });
  }

  // Run prisma db push to ensure schema is available
  try {
    execSync('npx prisma db push --schema=./prisma/schema.prisma', { cwd, stdio: 'inherit' });
  } catch (e) {
    console.warn('Prisma push failed, ensure prisma is installed and schema exists', e.message);
  }

  // Run TypeScript seed script (uses ts-node via package.json script)
  try {
    execSync('npm run seed --silent', { cwd, stdio: 'inherit' });
  } catch (e) {
    console.warn('Seeding test database failed (continuing):', e.message);
  }
}
