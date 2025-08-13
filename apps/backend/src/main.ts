import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: ['http://localhost:3001'], credentials: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  const port = process.env.PORT || 3000
  await app.listen(port as number)
  console.log(`Backend running on http://localhost:${port}`)
}
bootstrap()
