import {
  Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FlowsService } from './flows.service';
import { CreateFlowDto, UpdateFlowDto } from './flows.dto';

@UseGuards(JwtAuthGuard)
@Controller('flows')
export class FlowsController {
  constructor(private flows: FlowsService) {}

  @Get()
  findAll(@Request() req) {
    return this.flows.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.flows.findOne(id, req.user.organizationId);
  }

  @Post()
  create(@Body() dto: CreateFlowDto, @Request() req) {
    return this.flows.create(dto, req.user.organizationId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFlowDto, @Request() req) {
    return this.flows.update(id, dto, req.user.organizationId);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string, @Request() req) {
    return this.flows.publish(id, req.user.organizationId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.flows.remove(id, req.user.organizationId);
  }
}
