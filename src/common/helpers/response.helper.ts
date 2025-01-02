export class ResponseHelper {
  static success(message: string, data: any, statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode,
    };
  }

  static error(message: string, error: any, statusCode = 400) {
    return {
      success: false,
      message,
      error,
      statusCode,
    };
  }
}
