export type StorageType = 'file' | 'mongo';

export interface IConfig {
	// ТИП ХРАНИЛИЩА {"file", "mongo"}
	STORAGE_TYPE: StorageType; // "file"

	// ПОРТ приложения
	PORT: number; // 3000

	// КОНСТАНТЫ ДЛЯ РАБОТЫ С БД MONGO
	// строка подключения
	MONGO_URL: string; // "mongodb://localhost:27017/",
	// имя БД
	MONGO_DATABASE: string; //  "books",
	// пользователь и пароль для работы с БД
	MONGO_USERNAME: string; //  "user",
	MONGO_PASSWORD: string; //  "user",

	// КОНСТАНТЫ ДЛЯ РАБОТЫ С ФАЙЛАМИ
	DATA_PATH: string; //  "data/",
	UPLOAD_PATH: string; //  "public/upload"
	BOOKS_FILE: string; //  "books.json",
	USERS_FILE: string; //  "users.json",
	BOOKCOMMENTS_FILE: string; // "bookcomments.json"

	// КОНСТАНТЫ ДЛЯ ГЕНЕРАЦИИ JWT
	JWT_SECRET: string;
	JWT_EXPIRE: string;
}
