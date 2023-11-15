import { Schema as MongooseSchema, Document, model } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IBook } from '../books.interfaces';
import { User } from '../../users/storage/userSchema';

export type BookDocument = Book & Document;

@Schema()
export class Book implements IBook {
	@Prop({
		type: Number,
		//unique: true,     // не надо, _id и так unique
		required: true,
	})
	_id: number;

	@Prop({
		type: String,
		required: true,
	})
	title: string;

	@Prop()
	description: string;

	@Prop()
	authors: [string];

	@Prop()
	fileCover: string;

	@Prop()
	fileBook: string;

	@Prop({
		type: Number,
		required: true,
		ref: User.name,
	})
	owner: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
