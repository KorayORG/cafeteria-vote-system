import { IsArray, IsDateString, IsIn, IsNotEmpty } from 'class-validator'
import type { ShiftCode, Choice } from '../schemas/vote.schema'

const ALLOWED_SHIFTS: ShiftCode[] = ['08:00-16:00','16:00-00:00','00:00-08:00']

export class SubmitVoteDto {
  @IsDateString()
  weekStart!: string

  @IsIn(ALLOWED_SHIFTS as readonly string[])
  shift!: ShiftCode

  @IsArray()
  // class-validator runtime kontrolünü yapıyor; TS tarafında da Choice union’ını kullanıyoruz
  choices!: { day: string; choice: Choice }[]
}
