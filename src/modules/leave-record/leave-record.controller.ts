import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeaveRecordService } from './leave-record.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { LeaveRecordResponseDto } from './dto/response/leave-record.dto';
import * as moment from 'moment';
import { CreateLeaveRecordDto } from './dto/request/create.dto';
import { UpdateLeaveRecordDto } from './dto/request/update.dto';

@UseGuards(JwtAuthGuard)
@Controller('leave-records')
export class LeaveRecordController {
  constructor(private readonly leaveRecordService: LeaveRecordService) {}

  @Get()
  async findAll(@Query('month') month?: number, @Query('year') year?: number) {
    const leaveRecords = await this.leaveRecordService.findAll({
      month,
      year,
    });

    const data: LeaveRecordResponseDto[] = leaveRecords.map((leaveRecord) => ({
      id: leaveRecord.id,
      employee_id: leaveRecord.employee_id,
      reason: leaveRecord.reason,
      start_date: moment(leaveRecord.start_date).format('YYYY-MM-DD'),
      end_date: moment(leaveRecord.end_date).format('YYYY-MM-DD'),
      created_at: moment(leaveRecord.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(leaveRecord.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      employee: {
        id: leaveRecord.employee.id,
        first_name: leaveRecord.employee.first_name,
        last_name: leaveRecord.employee.last_name,
        email: leaveRecord.employee.email,
        phone_number: leaveRecord.employee.phone_number,
        address: leaveRecord.employee.address,
        gender: leaveRecord.employee.gender,
        created_at: moment(leaveRecord.employee.created_at).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        updated_at: moment(leaveRecord.employee.updated_at).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      },
    }));

    return ResponseHelper.success('Leave records fetched successfully', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const leaveRecord = await this.leaveRecordService.findOne(id);

    const data: LeaveRecordResponseDto = {
      id: leaveRecord.id,
      employee_id: leaveRecord.employee_id,
      reason: leaveRecord.reason,
      start_date: moment(leaveRecord.start_date).format('YYYY-MM-DD'),
      end_date: moment(leaveRecord.end_date).format('YYYY-MM-DD'),
      created_at: moment(leaveRecord.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(leaveRecord.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      employee: {
        id: leaveRecord.employee.id,
        first_name: leaveRecord.employee.first_name,
        last_name: leaveRecord.employee.last_name,
        email: leaveRecord.employee.email,
        phone_number: leaveRecord.employee.phone_number,
        address: leaveRecord.employee.address,
        gender: leaveRecord.employee.gender,
        created_at: moment(leaveRecord.employee.created_at).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        updated_at: moment(leaveRecord.employee.updated_at).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      },
    };

    return ResponseHelper.success('Leave record fetched successfully', data);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createLeaveRecordDto: CreateLeaveRecordDto) {
    const leaveRecord =
      await this.leaveRecordService.create(createLeaveRecordDto);

    const data: LeaveRecordResponseDto = {
      id: leaveRecord.id,
      employee_id: leaveRecord.employee_id,
      reason: leaveRecord.reason,
      start_date: moment(leaveRecord.start_date).format('YYYY-MM-DD'),
      end_date: moment(leaveRecord.end_date).format('YYYY-MM-DD'),
      created_at: moment(leaveRecord.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(leaveRecord.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      employee: {
        id: leaveRecord.employee.id,
        first_name: leaveRecord.employee.first_name,
        last_name: leaveRecord.employee.last_name,
        email: leaveRecord.employee.email,
        phone_number: leaveRecord.employee.phone_number,
        address: leaveRecord.employee.address,
        gender: leaveRecord.employee.gender,
        created_at: moment(leaveRecord.employee.created_at).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        updated_at: moment(leaveRecord.employee.updated_at).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      },
    };

    return ResponseHelper.success('Create leave record successfully', data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLeaveRecordDto: UpdateLeaveRecordDto,
  ) {
    const leaveRecord = await this.leaveRecordService.update(
      id,
      updateLeaveRecordDto,
    );

    const data: LeaveRecordResponseDto = {
      id: leaveRecord.id,
      employee_id: leaveRecord.employee_id,
      reason: leaveRecord.reason,
      start_date: moment(leaveRecord.start_date).format('YYYY-MM-DD'),
      end_date: moment(leaveRecord.end_date).format('YYYY-MM-DD'),
      created_at: moment(leaveRecord.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(leaveRecord.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      employee: {
        id: leaveRecord.employee.id,
        first_name: leaveRecord.employee.first_name,
        last_name: leaveRecord.employee.last_name,
        email: leaveRecord.employee.email,
        phone_number: leaveRecord.employee.phone_number,
        address: leaveRecord.employee.address,
        gender: leaveRecord.employee.gender,
        created_at: moment(leaveRecord.employee.created_at).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        updated_at: moment(leaveRecord.employee.updated_at).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      },
    };

    return ResponseHelper.success('Update leave record successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    await this.leaveRecordService.remove(id);
    return {
      success: true,
      message: 'Leave record deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
