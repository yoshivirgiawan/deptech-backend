import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birth_date: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
