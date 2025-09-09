import {
  IsString,
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
     @IsString()
     id: string
}
