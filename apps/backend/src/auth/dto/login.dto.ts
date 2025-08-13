import { IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsString()
  identityNumber!: string

  @IsString()
  @MinLength(6)
  password!: string
}
