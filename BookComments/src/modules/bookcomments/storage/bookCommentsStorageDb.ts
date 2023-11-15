import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { StorageDb } from '../../../storage/storageDb';
import { BookComment, BookCommentDocument } from './bookCommentsSchema';
import { IBookComment, IBookCommentDto } from '../bookcomments.interfaces';

@Injectable()
class BookCommentStorageDb extends StorageDb<BookCommentDocument, IBookCommentDto, '_id'> {
	constructor(
		@InjectModel(BookComment.name) private bookCommentModel: Model<BookCommentDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(bookCommentModel, '_id');
	}

	_getNextId(id: IBookComment['_id']) {
		if (id) return id + 1;
		return 1;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//

	// поиск всех комментариев по книге
	findAllBookComment(bookId: IBookComment['bookId']): Promise<IBookComment[]>{
		return this._model.find({'bookId': bookId}).exec();
	}
}

// экспорт класса
export { BookCommentStorageDb };
