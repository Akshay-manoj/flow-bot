import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateFlowDto {
  @IsString()
  name: string;

  @IsObject()
  definition: Record<string, any>;
}

export class UpdateFlowDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  definition?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
