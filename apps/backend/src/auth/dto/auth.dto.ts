import { IsString, MinLength } from 'class-validator'
export class RegisterDto {
  @IsString() identityNumber: string
  @IsString() fullName: string
  @IsString() phone: string
  @IsString() @MinLength(6) password: string
}
export class LoginDto {
  @IsString() identityNumber: string
  @IsString() @MinLength(6) password: string
}
