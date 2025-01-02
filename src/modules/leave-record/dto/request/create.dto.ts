import { IsNotEmpty, IsDateString, IsString } from 'class-validator';

export class CreateLeaveRecordDto {
  @IsNotEmpty()
  employee_id: number;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;
}
