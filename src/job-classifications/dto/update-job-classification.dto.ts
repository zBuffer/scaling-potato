import { PartialType } from '@nestjs/mapped-types';
import { CreateJobClassificationDto } from './create-job-classification.dto';

export class UpdateJobClassificationDto extends PartialType(
  CreateJobClassificationDto,
) {}
