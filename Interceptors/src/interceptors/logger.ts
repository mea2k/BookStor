import {
	CallHandler,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		let strOut =
			context.getClass().name + ' - ' + context.getHandler().name + ': ';
		const now = Date.now();
		return next.handle().pipe(
			tap(() => {
				strOut += 'success (' + (Date.now() - now) + ' ms)';
				console.log(strOut);
			}),
			// catchError((err) => {
			// 	strOut += 'error (' + (Date.now() - now) + ' ms)';
			// 	console.log(strOut);
			// 	//console.log('\tError message: ', err);
			// 	return throwError(
			// 		() =>
			// 			new HttpException(
			// 				err,
			// 				HttpStatus.INTERNAL_SERVER_ERROR,
			// 			),
			// 	);
			// }),
		);
	}
}
