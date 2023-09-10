import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		if (Math.random() > 0.75) {
			throw new HttpException('Random error', HttpStatus.INTERNAL_SERVER_ERROR);  //Error('Random error');
		}
		return 'Hello World!';
	}
}
