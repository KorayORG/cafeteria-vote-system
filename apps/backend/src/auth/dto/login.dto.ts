import { IsString, Matches } from 'class-validator'
import { Transform } from 'class-transformer'
const trim = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))

export class LoginDto {
  @IsString() @trim()
  @Matches(/^(?:\d{11}|[A-Za-z0-9]{5,20})$/,{ message:'Kimlik/Pasaport formatı geçersiz' })
  identityNumber!: string

  @IsString()
  password!: string
}
