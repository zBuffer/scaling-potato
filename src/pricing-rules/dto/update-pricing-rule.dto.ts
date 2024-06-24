
import { IsDate, ValidateIf } from 'class-validator';

export class UpdatePricingRuleDto {
    @IsDate()
    @ValidateIf(o => o.invalidated_at !== null)
    invalidated_at: Date | null;
}
