import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    let dbStatus = 'disconnected';
    let dbError = null;

    try {
      // Simple raw query to test Postgres connection
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
}
