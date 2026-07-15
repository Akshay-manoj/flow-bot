import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFlowDto, UpdateFlowDto } from './flows.dto';

@Injectable()
export class FlowsService {
  constructor(private prisma: PrismaService) {}

  findAll(organizationId: string) {
    return this.prisma.flow.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, isPublished: true, createdAt: true, updatedAt: true },
    });
  }

  async findOne(id: string, organizationId: string) {
    const flow = await this.prisma.flow.findFirst({ where: { id, organizationId } });
    if (!flow) throw new NotFoundException('Flow not found');
    return flow;
  }

  /** Find the currently published flow for an org (used by the WebSocket gateway) */
  async findPublished(organizationId: string) {
    return this.prisma.flow.findFirst({ where: { organizationId, isPublished: true } });
  }

  create(dto: CreateFlowDto, organizationId: string) {
    return this.prisma.flow.create({
      data: { name: dto.name, definition: dto.definition, organizationId },
    });
  }

  async update(id: string, dto: UpdateFlowDto, organizationId: string) {
    await this.findOne(id, organizationId); // ensures ownership
    return this.prisma.flow.update({ where: { id }, data: dto });
  }

  async publish(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    // Unpublish all other flows first (only one active at a time for MVP)
    await this.prisma.flow.updateMany({ where: { organizationId }, data: { isPublished: false } });
    return this.prisma.flow.update({ where: { id }, data: { isPublished: true } });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.flow.delete({ where: { id } });
  }
}
