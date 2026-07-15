import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connected successfully.');

    // Run migrations programmatically to ensure tables exist
    try {
      this.logger.log('Running pending migrations...');
      const { stdout, stderr } = await execAsync(
        'npx prisma migrate deploy --schema=prisma/schema.prisma'
      );
      if (stdout) this.logger.log(`Migration stdout: ${stdout}`);
      if (stderr) this.logger.warn(`Migration stderr: ${stderr}`);
      this.logger.log('Database migrations applied successfully.');
    } catch (error: any) {
      this.logger.error('Failed to apply migrations programmatically:', error.message);
      // Don't crash the server startup if migrations are already locked or in progress
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
