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
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { EmployeeResponseDto } from './dto/response/employee.dto';
import { CreateEmployeeDto } from './dto/request/create.dto';
import { UpdateEmployeeDto } from './dto/request/update.dto';
import * as moment from 'moment';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll() {
    const employees = await this.employeeService.findAll();

    const data: EmployeeResponseDto[] = employees.map((employee) => ({
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone_number: employee.phone_number,
      address: employee.address,
      gender: employee.gender,
      created_at: moment(employee.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(employee.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    }));

    return ResponseHelper.success('Employees fetched successfully', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const employee = await this.employeeService.findOne(id);

    const data: EmployeeResponseDto = {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone_number: employee.phone_number,
      address: employee.address,
      gender: employee.gender,
      created_at: moment(employee.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(employee.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    };

    return ResponseHelper.success('Employee fetched successfully', data);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeeService.create(createEmployeeDto);

    const data: EmployeeResponseDto = {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone_number: employee.phone_number,
      address: employee.address,
      gender: employee.gender,
      created_at: moment(employee.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(employee.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    };

    return ResponseHelper.success('Create employee successfully', data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const employee = await this.employeeService.update(id, updateEmployeeDto);

    const data: EmployeeResponseDto = {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone_number: employee.phone_number,
      address: employee.address,
      gender: employee.gender,
      created_at: moment(employee.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(employee.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    };

    return ResponseHelper.success('Update employee successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    await this.employeeService.remove(id);
    return {
      success: true,
      message: 'Employee deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
