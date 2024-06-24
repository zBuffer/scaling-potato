import { IsNotEmpty } from 'class-validator';

export class CreateAgencyFeeQuotationDto {
  @IsNotEmpty()
  recruitment_brief_id: string;
  @IsNotEmpty()
  pricing_rule_id: string;
}
