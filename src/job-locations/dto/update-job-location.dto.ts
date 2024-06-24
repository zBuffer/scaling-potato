import { PartialType } from '@nestjs/mapped-types';
import { CreateJobLocationDto } from './create-job-location.dto';

export class UpdateJobLocationDto extends PartialType(CreateJobLocationDto) {}
