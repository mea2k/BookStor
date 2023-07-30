import { Injectable } from '@nestjs/common';
import { IConfig } from './interfaces/config';

@Injectable()
export class ConfigService {
	private _config: IConfig;

	constructor() {
		/////////////////////////////////////////////////
		// КОНСТАНТЫ ПО УМОЛЧАНИЮ
		/////////////////////////////////////////////////
		this._config = {
			// ТИП ХРАНИЛИЩА {"file", "mongo"}
			STORAGE_TYPE: 'file',

			// ПОРТ приложения
			PORT: 3000,

			// ПУТИ ДЛЯ ХРАНЕНИЯ ДАННЫХ
			// И ЗАГРУЗКИ ФАЙЛОВ
			DATA_PATH: 'data/',
			UPLOAD_PATH: 'public/upload/',

			// КОНСТАНТЫ ДЛЯ РАБОТЫ С БД MONGO
			// строка подключения
			MONGO_URL: 'mongodb://localhost:27017/',
			// имя БД
			MONGO_DATABASE: 'books',
			// пользователь и пароль для работы с БД
			MONGO_USERNAME: 'user',
			MONGO_PASSWORD: 'user',

			// КОНСТАНТЫ ДЛЯ РАБОТЫ С ФАЙЛАМИ
			BOOKS_FILE: 'books.json',
			USERS_FILE: 'users.json',
		};

		/////////////////////////////////////////////////
		// ЗАГРУЗКА ДАННЫХ ИЗ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ PROCESS.ENV
		/////////////////////////////////////////////////
		this._config = {
			...this._config,
			...process.env,
		};
	}

	/** ПОЛУЧЕНИЕ ЗНАЧЕНИЕ НАСТРОЕК ПО КЛЮЧУ
	 * @params {string} key - ключ параметра
	 * @returns string - значение параметра ИЛИ NULL
	 */
	get(key: string): string {
		return this._config[key] || null;
	}
}
