import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  identityNumber: string;

  @IsString()
  password: string;
}
