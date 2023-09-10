import { Controller, UseInterceptors, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WrapperInterceptor } from './interceptors/wrapper';

@UseInterceptors(WrapperInterceptor)
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
