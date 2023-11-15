import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { StorageFile } from '../../../storage/storageFile';
import { IUSer, IUSerDto } from '../users.interfaces';
import { ConfigService } from '../../config/config.service';

@Injectable()
class UserStorageFile extends StorageFile<IUSer, IUSerDto, '_id'> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('USERS_FILE'), '_id');
	}

	_getNextId(id: IUSer['_id']) {
		// number
		if (id) return id + 1;
		return 1;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//

	getByLogin(login: IUSer['login']): Promise<IUSer | null> {
		return new Promise<IUSer | null>((resolve) =>
			resolve(this._storage.find((e) => e['login'] == login) || null),
		);
	}
}

// экспорт класса
export { UserStorageFile };
