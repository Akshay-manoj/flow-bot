import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../../prisma.service';
import { EngineService } from '../../engine/engine.service';
import { SessionsService } from '../../sessions/sessions.service';
import { FlowsService } from '../../flows/flows.service';
import { ContactsService } from '../../contacts/contacts.service';
import { FlowDefinition, SessionState } from '../../engine/engine.types';

@WebSocketGateway({
  namespace: '/widget',
  cors: {
    origin: '*', // Restrict in production via CORS_ORIGINS env var
    credentials: false,
  },
})
export class WebsiteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WebsiteGateway.name);

  constructor(
    private prisma: PrismaService,
    private engine: EngineService,
    private sessions: SessionsService,
    private flows: FlowsService,
    private contacts: ContactsService,
  ) {}

  async handleConnection(client: Socket) {
    const { orgApiToken, visitorId } = client.handshake.query as Record<string, string>;

    if (!orgApiToken || !visitorId) {
      this.logger.warn(`[${client.id}] Missing orgApiToken or visitorId — disconnecting`);
      client.disconnect();
      return;
    }

    // Resolve organization from API token
    const org = await this.prisma.organization.findUnique({ where: { apiToken: orgApiToken } });
    if (!org) {
      this.logger.warn(`[${client.id}] Invalid orgApiToken — disconnecting`);
      client.emit('error', { message: 'Invalid organization token' });
      client.disconnect();
      return;
    }

    // Store org/visitor on the socket for later handlers
    client.data.organizationId = org.id;
    client.data.visitorId = visitorId;

    this.logger.log(`[${client.id}] Connected — org: ${org.id}, visitor: ${visitorId}`);

    // Load or initialize session
    let session = await this.sessions.getSession(org.id, visitorId);

    if (!session) {
      // First visit — find the published flow
      const flow = await this.flows.findPublished(org.id);
      if (!flow) {
        client.emit('bot_message', { text: 'No active flow configured. Please check back later.' });
        return;
      }

      session = {
        flowId: flow.id,
        currentNodeId: (flow.definition as any).startNode,
        variables: {},
        awaitingInput: false,
      } satisfies SessionState;
    }

    // Greet — run the engine with no incoming message to send opening messages
    await this.runStep(client, session, undefined);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[${client.id}] Disconnected`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { text: string },
  ) {
    const { organizationId, visitorId } = client.data;
    if (!organizationId || !visitorId) return;

    const incomingText = typeof data === 'string' ? data : data?.text;
    if (!incomingText) return;

    // Log inbound message
    const contact = await this.contacts.upsertContact('website', visitorId, organizationId);
    await this.contacts.logMessage(contact.id, 'inbound', incomingText);

    // Load current session
    const session = await this.sessions.getSession(organizationId, visitorId);
    if (!session) {
      client.emit('bot_message', { text: 'Session expired. Please refresh to start over.' });
      return;
    }

    await this.runStep(client, session, incomingText);
  }

  private async runStep(client: Socket, session: SessionState, incomingMessage?: string) {
    const { organizationId, visitorId } = client.data;

    // Load flow definition from DB
    const flow = await this.prisma.flow.findUnique({ where: { id: session.flowId } });
    if (!flow) {
      client.emit('bot_message', { text: 'Flow not found.' });
      return;
    }

    const definition = flow.definition as unknown as FlowDefinition;
    const result = this.engine.step(definition, session, incomingMessage);

    // Persist updated session
    await this.sessions.saveSession(organizationId, visitorId, result.session);

    // Upsert contact and log outbound messages
    const contact = await this.contacts.upsertContact(
      'website', visitorId, organizationId, result.session.variables,
    );
    for (const text of result.outgoingMessages) {
      await this.contacts.logMessage(contact.id, 'outbound', text);
      // Small delay between messages to feel more natural
      client.emit('bot_message', { text });
    }

    if (result.done) {
      client.emit('flow_complete', { message: 'Thank you! Our team will be in touch.' });
    }
  }
}
