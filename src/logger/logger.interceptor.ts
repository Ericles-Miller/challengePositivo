import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, body, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url} - IP: ${ip} - UserAgent: ${userAgent}`);

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const responseTime = Date.now() - startTime;

        const logMessage = `Response: ${method} ${url} - Status: ${statusCode} - ${responseTime}ms`;

        if (statusCode >= 200 && statusCode < 300) {
          this.logger.log(`${logMessage}`);
        } else if (statusCode >= 300 && statusCode < 400) {
          this.logger.log(`${logMessage}`);
        } else if (statusCode >= 400 && statusCode < 500) {
          this.logger.warn(`${logMessage} - Body: ${JSON.stringify(body)}`);
        } else if (statusCode >= 500) {
          this.logger.error(`${logMessage} - Body: ${JSON.stringify(body)}`);
        }
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = error.status || 500;

        this.logger.error(
          `Error Response: ${method} ${url} - Status: ${statusCode} - ${responseTime}ms - Error: ${error.message}`,
          error.stack,
        );

        throw error;
      }),
    );
  }
}
