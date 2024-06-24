import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRecruitmentBriefDto {
  @IsOptional()
  @IsDateString()
  published_at?: string;

  @IsOptional()
  @IsNotEmpty()
  job_title: string;
  job_role_description?: string;
}
