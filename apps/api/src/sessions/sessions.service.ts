import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { SessionState } from '../engine/engine.types';

const SESSION_TTL_SECONDS = 24 * 60 * 60; // 24 hours

@Injectable()
export class SessionsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SessionsService.name);
  private client: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      retryStrategy: (times) => Math.min(times * 200, 3000),
    });
    this.client.on('error', (err) => this.logger.error('Redis error', err.message));
    this.client.connect().catch((err) => this.logger.error('Redis connect failed', err.message));
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }

  private key(orgId: string, visitorId: string): string {
    return `session:${orgId}:website:${visitorId}`;
  }

  async getSession(orgId: string, visitorId: string): Promise<SessionState | null> {
    const raw = await this.client.get(this.key(orgId, visitorId));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionState;
    } catch {
      return null;
    }
  }

  async saveSession(orgId: string, visitorId: string, state: SessionState): Promise<void> {
    await this.client.set(this.key(orgId, visitorId), JSON.stringify(state), 'EX', SESSION_TTL_SECONDS);
  }

  async deleteSession(orgId: string, visitorId: string): Promise<void> {
    await this.client.del(this.key(orgId, visitorId));
  }
}
