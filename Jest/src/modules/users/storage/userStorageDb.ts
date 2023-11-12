import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { IUSer, IUSerDto } from '../users.interfaces';
import { StorageDb } from '../../../storage/storageDb';
import { User, UserDocument } from './userSchema';

@Injectable()
class UserStorageDb extends StorageDb<UserDocument, IUSerDto, '_id'> {
	constructor(
		@InjectModel(User.name) private UserModel: Model<UserDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(UserModel, '_id');
	}

	_getNextId(id: IUSer['_id']) {
		if (id) return id + 1;
		return 1;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//

	async getByLogin(login: IUSer['login']): Promise<UserDocument | null | any> {
		return this._model.findOne({ login: login }).exec();
	}
}

// экспорт класса
export { UserStorageDb };
