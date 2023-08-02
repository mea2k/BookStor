import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { StorageFile } from '../container/storageFile';
import { IBook, IBookDto } from '../../interfaces/book';
import { ConfigService } from '../../../config/config.service';

@Injectable()
class BookStorageFile extends StorageFile<IBook, IBookDto, '_id'> {
	constructor(config: ConfigService) {
		//console.log('BOOKSTORAGEFILE - constructor')

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
}

// экспорт класса
export { BookStorageFile };
