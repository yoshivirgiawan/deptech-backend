import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeaveRecord } from './leave-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Raw, Repository } from 'typeorm';
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

    const { start_date, end_date, employee_id } = createLeaveRecordDto;

    // Validasi cuti dalam 1 tahun
    const currentYear = new Date().getFullYear();
    const leaveRecordsInYear = await this.leaveRecordRepository.find({
      where: {
        employee_id: employee_id,
        start_date: Between(
          new Date(currentYear, 0, 1),
          new Date(currentYear, 11, 31),
        ),
      },
    });

    const totalLeaveDaysInYear = leaveRecordsInYear.reduce((acc, record) => {
      const recordDays =
        (new Date(record.end_date).getTime() -
          new Date(record.start_date).getTime()) /
          (1000 * 60 * 60 * 24) +
        1;
      return acc + recordDays;
    }, 0);

    const requestedLeaveDays =
      (new Date(end_date).getTime() - new Date(start_date).getTime()) /
        (1000 * 60 * 60 * 24) +
      1;

    if (totalLeaveDaysInYear + requestedLeaveDays > 12) {
      throw new BadRequestException(
        'Employee can only take up to 12 leave days in a year',
      );
    }

    // Validasi cuti dalam bulan yang sama
    const requestedMonth = new Date(start_date).getMonth();
    const hasLeaveInSameMonth = leaveRecordsInYear.some((record) => {
      const recordMonth = new Date(record.start_date).getMonth();
      return recordMonth === requestedMonth;
    });

    if (hasLeaveInSameMonth) {
      throw new BadRequestException(
        'Employee can only take 1 leave day in the same month',
      );
    }

    // Simpan data cuti
    const leaveRecord = await this.leaveRecordRepository.save({
      employee_id,
      reason: createLeaveRecordDto.reason,
      start_date,
      end_date,
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
      relations: ['employee'],
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

    const { start_date, end_date, employee_id } = updateLeaveRecordDto;

    // Validasi cuti dalam 1 tahun
    const currentYear = new Date().getFullYear();
    const leaveRecordsInYear = await this.leaveRecordRepository.find({
      where: {
        employee_id: employee_id,
        start_date: Between(
          new Date(currentYear, 0, 1),
          new Date(currentYear, 11, 31),
        ),
      },
    });

    const totalLeaveDaysInYear = leaveRecordsInYear.reduce((acc, record) => {
      if (record.id !== id) {
        const recordDays =
          (new Date(record.end_date).getTime() -
            new Date(record.start_date).getTime()) /
            (1000 * 60 * 60 * 24) +
          1;
        return acc + recordDays;
      }
      return acc;
    }, 0);

    const requestedLeaveDays =
      (new Date(end_date).getTime() - new Date(start_date).getTime()) /
        (1000 * 60 * 60 * 24) +
      1;

    if (totalLeaveDaysInYear + requestedLeaveDays > 12) {
      throw new BadRequestException(
        'Employee can only take up to 12 leave days in a year',
      );
    }

    // Validasi cuti dalam bulan yang sama
    const requestedMonth = new Date(start_date).getMonth();
    const hasLeaveInSameMonth = leaveRecordsInYear.some((record) => {
      const recordMonth = new Date(record.start_date).getMonth();
      return recordMonth === requestedMonth && record.id !== id;
    });

    if (hasLeaveInSameMonth) {
      throw new BadRequestException(
        'Employee can only take 1 leave day in the same month',
      );
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
