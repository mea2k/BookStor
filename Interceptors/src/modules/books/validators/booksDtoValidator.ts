import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IBookDto } from '../interfaces/book';

@Injectable()
export class BooksDtoValidator implements PipeTransform {
	transform(data: any, metadata: ArgumentMetadata) {
		// проверка на наличие обязательных полей
		// (title)
		if (!data.title || data.title === undefined || data.title == '') {
			throw new BadRequestException('Title expected!');
		}
		// копируем все необходимые параметры
		// или заполняем значениями по умолчанию
		const result: IBookDto = {
			title: data.title,
			authors: data.authors || [],
			description: data.description || '',
			fileBook: data.fileBook || '',
			fileCover: data.fileCover || '',
		};

		return result;
	}
}
