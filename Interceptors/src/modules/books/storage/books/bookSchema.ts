import { Schema as MongooseSchema, Document, model } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IBook } from '../../interfaces/book';

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
}

export const BookSchema = SchemaFactory.createForClass(Book);
