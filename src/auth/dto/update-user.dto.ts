import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional(null)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional(null)
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsOptional(null)
  @IsNotEmpty()
  @IsString()
  phone: string;
}
