import { execSync } from 'child_process';
import * as path from 'path';

export default async function globalTeardown() {
  const cwd = path.resolve(__dirname, '..');
  try {
    execSync('docker compose -f docker-compose.test.yml down --volumes', { cwd, stdio: 'inherit' });
  } catch (e) {
    console.warn('Failed to stop docker compose test services', e.message);
  }
}
