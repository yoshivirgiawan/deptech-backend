import { Module } from '@nestjs/common';
import { LeaveRecordController } from './leave-record.controller';
import { LeaveRecordService } from './leave-record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRecord } from './leave-record.entity';
import { Employee } from '../employee/employee.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRecord, Employee]), AuthModule],
  controllers: [LeaveRecordController],
  providers: [LeaveRecordService],
})
export class LeaveRecordModule {}
