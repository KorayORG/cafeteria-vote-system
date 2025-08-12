import { IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  identityNumber: string;

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  @Length(6, 100)
  password: string;
}
