import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
    app.enableCors({
    origin: 'http://localhost:3001', // your Next.js frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // if you need cookies/auth
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
