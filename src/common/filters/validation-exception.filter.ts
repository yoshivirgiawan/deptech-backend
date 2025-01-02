import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const exceptionResponse: any = exception.getResponse();
    const validationErrors = exceptionResponse.message;

    response.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Bad Request Exception',
      errors: validationErrors,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
