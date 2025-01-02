import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { AdminResponseDto } from '../admin/dto/response/admin.dto';
import { CreateAdminDto } from '../admin/dto/request/create.dto';
import { UpdateAdminDto } from '../admin/dto/request/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    const duplicatedEmail = await this.userRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (duplicatedEmail) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createAdminDto.password,
      saltRounds,
    );

    const userData = this.userRepository.create({
      first_name: createAdminDto.first_name,
      last_name: createAdminDto.last_name,
      email: createAdminDto.email,
      birth_date: createAdminDto.birth_date,
      gender: createAdminDto.gender,
      password: hashedPassword,
      role: 'admin',
    });
    const user = await this.userRepository.save(userData);

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birth_date: moment(user.birth_date).format('YYYY-MM-DD'),
      gender: user.gender,
      created_at: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.first_name = updateAdminDto.first_name || user.first_name;
    user.last_name = updateAdminDto.last_name || user.last_name;
    user.email = updateAdminDto.email || user.email;
    user.birth_date = new Date(updateAdminDto.birth_date) || user.birth_date;
    user.gender = updateAdminDto.gender || user.gender;

    if (updateAdminDto.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        updateAdminDto.password,
        saltRounds,
      );
      user.password = hashedPassword;
    }

    await this.userRepository.save(user);

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birth_date: moment(user.birth_date).format('YYYY-MM-DD'),
      gender: user.gender,
      created_at: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAllAdmins(): Promise<AdminResponseDto[]> {
    const admins = await this.userRepository.find({ where: { role: 'admin' } });

    return admins.map((admin) => ({
      id: admin.id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      birth_date: moment(admin.birth_date).format('YYYY-MM-DD'),
      gender: admin.gender,
      created_at: moment(admin.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(admin.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    }));
  }

  async findOne(id: number): Promise<AdminResponseDto> {
    const admin = await this.userRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return {
      id: admin.id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      birth_date: moment(admin.birth_date).format('YYYY-MM-DD'),
      gender: admin.gender,
      created_at: moment(admin.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(admin.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
  }
}
