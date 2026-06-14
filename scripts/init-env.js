import { existsSync, copyFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const services = ["item", "order", "payment", "restaurant", "rider", "user", "gateway"];

for (const service of services) {
  const example = join(service, '.env.example');
  const dest = join(service, '.env');

  if (existsSync(dest)) {
    console.log(`⏭ skipped  ${service}/.env (already exists)`);
    continue;
  }

  if (existsSync(example)) {
    copyFileSync(example, dest);
    console.log(`✓ created  ${service}/.env (from .env.example)`);
  } else {
    writeFileSync(dest, '');
    console.log(`✓ created  ${service}/.env (empty)`);
  }
}