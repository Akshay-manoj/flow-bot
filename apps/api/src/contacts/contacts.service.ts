import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  findAll(organizationId: string) {
    return this.prisma.contact.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    });
  }

  findMessages(contactId: string, organizationId: string) {
    return this.prisma.message.findMany({
      where: { contact: { id: contactId, organizationId } },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Upsert a contact by channel + externalId. Called by the WebSocket gateway. */
  async upsertContact(
    channel: string,
    externalId: string,
    organizationId: string,
    variables?: Record<string, string>,
  ) {
    return this.prisma.contact.upsert({
      where: { channel_externalId_organizationId: { channel, externalId, organizationId } },
      create: { channel, externalId, organizationId, variables: variables || {} },
      update: variables ? { variables } : {},
    });
  }

  /** Log an inbound or outbound message to the DB */
  async logMessage(contactId: string, direction: 'inbound' | 'outbound', text: string) {
    return this.prisma.message.create({ data: { contactId, direction, text } });
  }
}
