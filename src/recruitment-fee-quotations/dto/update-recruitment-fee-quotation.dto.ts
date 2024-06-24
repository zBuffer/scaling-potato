import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruitmentFeeQuotationDto } from './create-recruitment-fee-quotation.dto';

export class UpdateRecruitmentFeeQuotationDto extends PartialType(
  CreateRecruitmentFeeQuotationDto,
) {}
