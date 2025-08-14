import { IsString, MinLength, Matches } from 'class-validator'
import { Transform } from 'class-transformer'

const trim = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))

export class RegisterDto {
  @IsString() @trim()
  // TCKN (11 rakam) veya pasaport (en az 5, harf/rakam)
  @Matches(/^(?:\d{11}|[A-Za-z0-9]{5,20})$/,{ message:'Kimlik/Pasaport formatı geçersiz' })
  identityNumber!: string

  @IsString() @trim()
  @Matches(/^\S.+\S$/,{ message:'Ad Soyad boş olamaz' })
  fullName!: string

  @IsString() @trim()
  // TR telefon: 10 hane (başında 0 olmadan)
  @Matches(/^\d{10}$/,{ message:'Telefon 10 haneli olmalı (örn: 5XXXXXXXXX)' })
  phone!: string

  @IsString() @MinLength(6)
  // En az 6: büyük/küçük/özel karakter kontrolü istersen buraya eklenebilir
  password!: string
}
