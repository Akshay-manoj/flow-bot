import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactsService } from './contacts.service';

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private contacts: ContactsService) {}

  @Get()
  findAll(@Request() req) {
    return this.contacts.findAll(req.user.organizationId);
  }

  @Get(':id/messages')
  findMessages(@Param('id') id: string, @Request() req) {
    return this.contacts.findMessages(id, req.user.organizationId);
  }
}
