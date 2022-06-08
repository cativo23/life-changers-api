export class ApiController {
  public successResponse(data: any, message: string = 'Success'): any {
    return {
      status: 'success',
      message: message,
      data: data,
    };
  }

  public errorResponse(data: any, message: string = 'Error'): any {
    return {
      status: 'error',
      message: message,
      data: data,
    };
  }
}
