import { Schema as MongooseSchema, Document, model } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUSer } from '../users.interfaces';

export type UserDocument = User & Document;

@Schema()
export class User implements IUSer {
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
	email: string;

	@Prop({
		type: String,
		required: true,
	})
	login: string;

	@Prop()
	firstName: string;

	@Prop({
		type: String,
		required: true,
	})
	password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
