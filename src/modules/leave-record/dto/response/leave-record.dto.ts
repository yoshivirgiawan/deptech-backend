import { EmployeeResponseDto } from './employee.dto';

export class LeaveRecordResponseDto {
  id: number;
  employee: EmployeeResponseDto;
  reason: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}
