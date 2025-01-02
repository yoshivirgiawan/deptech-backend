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
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { AdminResponseDto } from './dto/response/admin.dto';
import { CreateAdminDto } from './dto/request/create.dto';
import { UpdateAdminDto } from './dto/request/update.dto';

@UseGuards(JwtAuthGuard)
@Controller('admins')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const data: AdminResponseDto[] = await this.userService.findAllAdmins();

    return ResponseHelper.success('Admins fetched successfully', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data: AdminResponseDto = await this.userService.findOne(id);

    return ResponseHelper.success('Admin fetched successfully', data);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createAdminDto: CreateAdminDto) {
    const data: AdminResponseDto =
      await this.userService.create(createAdminDto);

    return ResponseHelper.success('Create admin successfully', data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const data: AdminResponseDto = await this.userService.update(
      id,
      updateAdminDto,
    );

    return ResponseHelper.success('Update admin successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    await this.userService.remove(id);
    return {
      success: true,
      message: 'Admin deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
