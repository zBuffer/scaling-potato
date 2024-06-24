import { IsJSON, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateJobLocationDto {
  @IsNotEmpty()
  id: string;

  @MaxLength(255)
  @IsJSON()
  label?: string;
}
