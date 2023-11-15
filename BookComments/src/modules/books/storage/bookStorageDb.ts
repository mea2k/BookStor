import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Book, BookDocument } from './bookSchema';
import { Connection, Model } from 'mongoose';
import { StorageDb } from '../../../storage/storageDb';
import { IBookDto, IBook } from '../books.interfaces';

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

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//

	// их пока нет

}

// экспорт класса
export { BookStorageDb };
