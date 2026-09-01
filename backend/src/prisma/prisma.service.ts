import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    let dbPath = path.resolve(process.cwd(), '../prisma/dev.db');
    if (!fs.existsSync(dbPath)) {
      dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
    }
    if (!fs.existsSync(dbPath)) {
      dbPath = path.resolve(__dirname, '../../../../prisma/dev.db');
    }
    const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;

    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
