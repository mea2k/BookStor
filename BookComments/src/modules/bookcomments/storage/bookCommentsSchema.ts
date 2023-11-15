import { Schema as MongooseSchema, Document, model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/storage/userSchema';
import { Book } from 'src/modules/books/storage/bookSchema';
import { IBookComment } from '../bookcomments.interfaces';

export type BookCommentDocument = BookComment & Document;

@Schema()
export class BookComment implements IBookComment {
	@Prop({
		type: Number,
		//unique: true,     // не надо, _id и так unique
		required: true,
	})
	_id: number;

	@Prop({
		type: Number,
		required: true,
		ref: Book.name,
	})
	bookId: number;

	@Prop({
		type: Number,
		required: true,
		ref: User.name,
	})
	user: number;


	@Prop({
		type: String,
		required: true,
	})
	comment: string;

	@Prop({
		type: Date,
		default: Date.now
	})
	date: Date;

}

export const BookCommentSchema = SchemaFactory.createForClass(BookComment);
