import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './interceptors/logger';
import { HttpExceptionFilter } from './exceptions/http.exception';

async function runServer() {
	const app = await NestFactory.create(AppModule);
	// добавление глобального перехватчика
	app.useGlobalInterceptors(new LoggerInterceptor());

	// добавление глобального фильтра исключений
	app.useGlobalFilters(new HttpExceptionFilter());

	// прослушивание порта
	await app.listen(3000);
}

///////////////////////////////////////////////////////////////////////////////

runServer();
