import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookStorageDb } from './storage/books/bookStorageDb';
import { BookStorageFile } from './storage/books/bookStorageFile';
import { MyConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './storage/books/bookSchema';
import { BOOKS_STORAGE } from './interfaces/book';

@Module({
	imports: [
		// модуль настроек
		MyConfigModule,

		// если тип хранилища MONGO
		// подключаем MongooseModule и устанавливаем соединение с базой
		// иначе подключаем BookStorageFile
		...(process.env.STORAGE_TYPE === 'mongo'
			? [
					MongooseModule.forRoot(
						process.env.MONGO_URL +
							process.env.MONGO_DATABASE +
							'?authSource=admin',
						{
							auth: {
								username: process.env.MONGO_USERNAME,
								password: process.env.MONGO_PASSWORD,
							},
						},
					),
			  ]
			: []),

		// если тип хранилища MONGO
		// подключаем схему данных BookSchema с использованием MongooseModule
		...(process.env.STORAGE_TYPE === 'mongo'
			? [
					MongooseModule.forFeature([
						{ name: Book.name, schema: BookSchema },
					]),
			  ]
			: []),
	],
	controllers: [BooksController],
	providers: [
		BooksService,
		{
			// если тип хранилища MONGO
			// подключаем BookStorageDb
			// иначе подключаем BookStorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? BookStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? BookStorageFile
					: BookStorageFile,
			provide: BOOKS_STORAGE,
		},
	],
})
export class BooksModule {}
