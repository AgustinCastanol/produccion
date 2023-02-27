import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CorsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Credentials', 'true');
    response.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    response.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    if (request.method === 'OPTIONS') {
      response.status(204).send();
      return false;
    }
    return true;
  }
}
