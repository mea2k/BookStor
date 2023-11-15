import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { StorageFile } from '../../../storage/storageFile';
import { IBookComment, IBookCommentDto } from '../bookcomments.interfaces';

@Injectable()
class BookCommentStorageFile extends StorageFile<IBookComment, IBookCommentDto, '_id'> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('BOOKCOMMENTS_FILE'), '_id');
	}

	_getNextId(id: IBookComment['_id']) {
		// number
		if (id) return id + 1;
		return 1;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//

	// поиск всех комментариев по книге
	findAllBookComment(bookId: IBookComment['bookId']): Promise<IBookComment[]>{
		return new Promise<IBookComment[]>((resolve) =>
			resolve(this._storage.filter((e) => e['bookId'] == bookId) || null)
		);
	}
}

// экспорт класса
export { BookCommentStorageFile };
