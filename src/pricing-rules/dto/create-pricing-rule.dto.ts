import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePricingRuleDto {
  @IsNumber()
  @Min(0)
  rate_recruitment_fee: number;

  @IsNumber()
  @Min(0)
  rate_agency_fee: number;

  @IsNotEmpty()
  job_location_id: string;

  @IsNotEmpty()
  job_classification_id: string;
}
