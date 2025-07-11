import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('test pull request CI');
    return 'Hello World!';
  }
}
