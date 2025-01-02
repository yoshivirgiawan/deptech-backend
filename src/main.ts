import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

function validationExceptionFactory(errors: ValidationError[]) {
  const formattedErrors = errors.map((error) => ({
    field: error.property,
    errors: Object.values(error.constraints || {}),
  }));

  throw new BadRequestException({
    statusCode: 400,
    message: 'Validation failed',
    error: formattedErrors,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
