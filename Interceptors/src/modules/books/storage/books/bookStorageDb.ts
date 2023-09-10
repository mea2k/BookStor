import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { StorageDb } from '../container/storageDb';
import { IBook, IBookDto } from '../../interfaces/book';
import { Book, BookDocument } from './bookSchema';
import { Connection, Model } from 'mongoose';

@Injectable()
class BookStorageDb extends StorageDb<BookDocument, IBookDto, '_id'> {
	constructor(
		@InjectModel(Book.name) private BookModel: Model<BookDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(BookModel, '_id');
	}

	_getNextId(id: IBook['_id']) {
		if (id) return id + 1;
		return 1;
	}
}

// экспорт класса
export { BookStorageDb };
