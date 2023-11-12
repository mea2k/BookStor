import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyConfigModule } from '../config/config.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserStorageFile } from './storage/userStorageFile';
import { UserStorageDb } from './storage/userStorageDb';
import { USERS_STORAGE } from './users.interfaces';
import { User, UserSchema } from './storage/userSchema';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [
		// модуль настроек
		MyConfigModule,

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
		// подключаем схему данных UserSchema с использованием MongooseModule
		...(process.env.STORAGE_TYPE === 'mongo'
			? [
					MongooseModule.forFeature([
						{ name: User.name, schema: UserSchema },
					]),
			  ]
			: []),
	],
	controllers: [UsersController],
	providers: [
		UsersService,
		{
			// если тип хранилища MONGO
			// подключаем UserStorageDb
			// иначе подключаем UserStorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? UserStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? UserStorageFile
					: UserStorageFile,
			provide: USERS_STORAGE,
		},
		AuthService,
		JwtService,
	],
	exports: [UsersService],
})
export class UsersModule {}
