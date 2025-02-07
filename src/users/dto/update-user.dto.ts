import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Entity } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  department?: string;

  @IsString()
  role?: string;
}
