import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookStorageDb } from './storage/bookStorageDb';
import { BookStorageFile } from './storage/bookStorageFile';
import { MyConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './storage/bookSchema';
import { BOOKS_STORAGE } from './books.interfaces';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [
		// модуль настроек
		MyConfigModule,

		UsersModule,

		// если тип хранилища MONGO
		// подключаем MongooseModule и устанавливаем соединение с базой
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
		AuthService,
		JwtService,
	],
})
export class BooksModule {}
