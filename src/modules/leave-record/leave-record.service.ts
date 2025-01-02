import { Injectable, NotFoundException } from '@nestjs/common';
import { LeaveRecord } from './leave-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CreateLeaveRecordDto } from './dto/request/create.dto';
import { Employee } from '../employee/employee.entity';
import { UpdateLeaveRecordDto } from './dto/request/update.dto';

@Injectable()
export class LeaveRecordService {
  constructor(
    @InjectRepository(LeaveRecord)
    private readonly leaveRecordRepository: Repository<LeaveRecord>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(filters: {
    month?: number;
    year?: number;
  }): Promise<LeaveRecord[]> {
    const whereConditions: any = {};

    if (filters.month && filters.year) {
      whereConditions.start_date = Raw(
        (alias) => `MONTH(${alias}) = :month AND YEAR(${alias}) = :year`,
        { month: filters.month, year: filters.year },
      );
    } else if (filters.month) {
      whereConditions.start_date = Raw((alias) => `MONTH(${alias}) = :month`, {
        month: filters.month,
      });
    } else if (filters.year) {
      whereConditions.start_date = Raw((alias) => `YEAR(${alias}) = :year`, {
        year: filters.year,
      });
    }

    return await this.leaveRecordRepository.find({
      where: whereConditions,
      relations: ['employee'],
    });
  }

  async findOne(id: number): Promise<LeaveRecord> {
    return await this.leaveRecordRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
  }

  async create(
    createLeaveRecordDto: CreateLeaveRecordDto,
  ): Promise<LeaveRecord> {
    const employee = await this.employeeRepository.findOneBy({
      id: createLeaveRecordDto.employee_id,
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const leaveRecord = await this.leaveRecordRepository.save({
      employee_id: createLeaveRecordDto.employee_id,
      reason: createLeaveRecordDto.reason,
      start_date: createLeaveRecordDto.start_date,
      end_date: createLeaveRecordDto.end_date,
    });

    return this.leaveRecordRepository.findOne({
      where: { id: leaveRecord.id },
      relations: ['employee'],
    });
  }

  async update(
    id: number,
    updateLeaveRecordDto: UpdateLeaveRecordDto,
  ): Promise<LeaveRecord> {
    const leaveRecord = await this.leaveRecordRepository.findOne({
      where: { id },
    });

    if (!leaveRecord) {
      throw new NotFoundException('Leave record not found');
    }

    const employee = await this.employeeRepository.findOneBy({
      id: updateLeaveRecordDto.employee_id,
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    leaveRecord.employee_id = updateLeaveRecordDto.employee_id;
    leaveRecord.reason = updateLeaveRecordDto.reason;
    leaveRecord.start_date = new Date(updateLeaveRecordDto.start_date);
    leaveRecord.end_date = new Date(updateLeaveRecordDto.end_date);

    return await this.leaveRecordRepository.save(leaveRecord);
  }

  async remove(id: number): Promise<void> {
    const leaveRecord = await this.leaveRecordRepository.findOne({
      where: { id },
    });

    if (!leaveRecord) {
      throw new NotFoundException('Leave record not found');
    }

    await this.leaveRecordRepository.remove(leaveRecord);
  }
}
