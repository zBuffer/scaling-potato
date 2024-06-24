import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateRecruitmentBriefDto {
  @IsOptional()
  @IsNotEmpty()
  author?: string;
  @IsOptional()
  @IsDateString()
  published_at?: string;

  @IsNotEmpty()
  job_title: string;
  job_role_description?: string;

  @IsNumber()
  @Min(0)
  annual_salary: number;

  @IsNotEmpty()
  job_location_id: string;
  @IsNotEmpty()
  job_classification_id: string;
}
