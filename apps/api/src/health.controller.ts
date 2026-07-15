import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    let dbStatus = 'disconnected';
    let dbError = null;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (e: any) {
      dbStatus = 'error';
      dbError = {
        message: e.message,
        code: e.code,
        meta: e.meta,
      };
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        error: dbError,
      },
      logs: require('./debug-exception.filter').globalLogs,
    };
  }

  @Get('migrate')
  async runMigrations() {
    try {
      const { stdout, stderr } = await execAsync(
        'npx prisma migrate deploy --schema=prisma/schema.prisma'
      );
      return {
        success: true,
        stdout,
        stderr,
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message,
        stack: e.stack,
        stdout: e.stdout,
        stderr: e.stderr,
      };
    }
  }
}
