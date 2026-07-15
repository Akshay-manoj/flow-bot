import { Module } from '@nestjs/common';
import { WebsiteGateway } from './website.gateway';
import { EngineModule } from '../../engine/engine.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { FlowsModule } from '../../flows/flows.module';
import { ContactsModule } from '../../contacts/contacts.module';

@Module({
  imports: [EngineModule, SessionsModule, FlowsModule, ContactsModule],
  providers: [WebsiteGateway],
})
export class WebsiteModule {}
