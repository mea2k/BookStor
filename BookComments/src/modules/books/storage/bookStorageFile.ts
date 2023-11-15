import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { IBook, IBookDto } from '../books.interfaces';
import { ConfigService } from '../../config/config.service';
import { StorageFile } from '../../../storage/storageFile';

@Injectable()
class BookStorageFile extends StorageFile<IBook, IBookDto, '_id'> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('BOOKS_FILE'), '_id');
	}

	_getNextId(id: IBook['_id']) {
		// number
		if (id) return id + 1;
		return 1;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//

	// их пока нет
}

// экспорт класса
export { BookStorageFile };
