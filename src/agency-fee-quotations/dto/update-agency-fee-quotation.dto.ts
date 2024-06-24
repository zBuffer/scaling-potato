import { PartialType } from '@nestjs/mapped-types';
import { CreateAgencyFeeQuotationDto } from './create-agency-fee-quotation.dto';

export class UpdateAgencyFeeQuotationDto extends PartialType(
  CreateAgencyFeeQuotationDto,
) {}
