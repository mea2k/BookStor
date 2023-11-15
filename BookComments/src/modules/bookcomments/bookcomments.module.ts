import { Module } from '@nestjs/common';
import { BookCommentsController } from './bookcomments.controller';
import { BookCommentsService } from './bookcomments.service';
import { BookCommentsGateway } from './bookcomments.gateway';
import { MyConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BookComment, BookCommentSchema } from './storage/bookCommentsSchema';
import { BookCommentStorageDb } from './storage/bookCommentsStorageDb';
import { BookCommentStorageFile } from './storage/bookCommentsStorageFile';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BOOKCOMMENTS_STORAGE } from './bookcomments.interfaces';

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
		// подключаем схему данных BookCommentSchema с использованием MongooseModule
		...(process.env.STORAGE_TYPE === 'mongo'
			? [
					MongooseModule.forFeature([
						{ name: BookComment.name, schema: BookCommentSchema },
					]),
			  ]
			: []),
	],
	controllers: [BookCommentsController],
	providers: [
		BookCommentsService,
		BookCommentsGateway,
		{
			// если тип хранилища MONGO
			// подключаем BookStorageDb
			// иначе подключаем BookStorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? BookCommentStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? BookCommentStorageFile
					: BookCommentStorageFile,
			provide: BOOKCOMMENTS_STORAGE,
		},
		AuthService,
		JwtService,
	]
})
export class BookCommentsModule {}
