import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/request/create.dto';
import { UpdateEmployeeDto } from './dto/request/update.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const duplicateEmail = await this.employeeRepository.findOne({
      where: { email: createEmployeeDto.email },
    });

    if (duplicateEmail) {
      throw new UnprocessableEntityException('Email already exists');
    }

    return await this.employeeRepository.save(createEmployeeDto);
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const duplicateEmail = await this.employeeRepository.findOne({
      where: { email: updateEmployeeDto.email, id: Not(id) },
    });

    if (duplicateEmail) {
      throw new UnprocessableEntityException('Email already exists');
    }

    employee.first_name = updateEmployeeDto.first_name;
    employee.last_name = updateEmployeeDto.last_name;
    employee.email = updateEmployeeDto.email;
    employee.phone_number = updateEmployeeDto.phone_number;
    employee.address = updateEmployeeDto.address;
    employee.gender = updateEmployeeDto.gender;

    return await this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.employeeRepository.delete(id);
  }
}
