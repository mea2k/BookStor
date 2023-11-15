// eslint-disable-next-line prettier/prettier
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IUSerDto } from '../users.interfaces';

// Проверка на шаблон строки:
//  xxx@xxx.xx
const checkEmail = (str: any) => {
	return (
		String(str)
			.toLowerCase()
			.match(/^([a-z0-9_\-.]+)@([a-z0-9_\-]{2,}).([a-z]{2,6})/) == null
	);
};

@Injectable()
export class UsersDtoValidator implements PipeTransform {
	transform(data: any, metadata: ArgumentMetadata) {
		// проверка на наличие обязательных полей

		// (email)
		if (!data.email || data.email === undefined || data.email == '') {
			throw new BadRequestException('Email expected!');
		}

		if (checkEmail(data.email)) {
			throw new BadRequestException('Not valid Email!');
		}

		// (login)
		if (!data.login || data.login === undefined || data.login == '') {
			throw new BadRequestException('Login expected!');
		}

		// (password1 && password2)
		if (
			!data.password1 ||
			data.password1 === undefined ||
			data.password1 == '' ||
			!data.password2 ||
			data.password2 === undefined ||
			data.password2 == ''
		) {
			throw new BadRequestException('Both passwords expected!');
		}

		if (data.password1 !== data.password2) {
			throw new BadRequestException('Passwords are not equal!');
		}

		// копируем все необходимые параметры
		// или заполняем значениями по умолчанию
		const result: IUSerDto = {
			login: data.login,
			email: data.email,
			firstName: data.firstName || '',
			password: data.password1,
		};

		return result;
	}
}
