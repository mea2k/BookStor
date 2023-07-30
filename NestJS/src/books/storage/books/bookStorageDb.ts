import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { StorageDb } from '../container/storageDb';
import { IBook, IBookDto } from 'src/books/interfaces/book';
import { BookModel } from './bookModel';

@Injectable()
class BookStorageDb extends StorageDb<IBook, IBookDto, '_id'> {
	constructor() {
		super(BookModel, '_id');
	}

	_getNextId(id: IBook['_id']) {
		if (id) return id + 1;
		return 1;
	}
}

// экспорт класса
export { BookStorageDb };
