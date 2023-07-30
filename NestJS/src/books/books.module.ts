import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookStorageDb } from './storage/books/bookStorageDb';
import { BookStorageFile } from './storage/books/bookStorageFile';
import { ConfigModule } from '../config/config.module';

@Module({
	imports: [ConfigModule],
	controllers: [BooksController],
	providers: [
		BooksService,
		BookStorageFile,
		//BookStorageDb
	],
})
export class BooksModule { }
