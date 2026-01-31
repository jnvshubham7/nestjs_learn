import { NestFactory } from '@nestjs/core';
// nextjsfactoy is used to create an instance of the NestJS application
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
