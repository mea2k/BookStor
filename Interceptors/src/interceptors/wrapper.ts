import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, from, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable()
export class WrapperInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				return {
					code: context.switchToHttp().getResponse().statusCode,
					status: 'success',
					data: data,
				};
			}),
			// catchError((err) => {
			// 	return of({
			// 		code: context.switchToHttp().getResponse().statusCode,
			// 		status: 'fail',
			// 		data: err,
			// 	});
			// }),
		);
	}
}
