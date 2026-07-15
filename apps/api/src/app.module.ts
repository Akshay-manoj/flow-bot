import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FlowsModule } from './flows/flows.module';
import { ContactsModule } from './contacts/contacts.module';
import { WebsiteModule } from './channels/website/website.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    AuthModule,
    FlowsModule,
    ContactsModule,
    WebsiteModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
