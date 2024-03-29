import { Injectable, Inject } from '@nestjs/common';
import { BookStorageFile } from './storage/bookStorageFile';
import { BOOKS_STORAGE, IBookDto } from './books.interfaces';
import { ConfigService } from '../config/config.service';

@Injectable()
export class BooksService {
	//private readonly _storage: BookStorageDb | BookStorageFile;

	constructor(
		config: ConfigService,
		@Inject(BOOKS_STORAGE)
		private readonly _storage: BookStorageFile,
	) {
		//console.log('BOOKSSERVICE - constructor');
	}

	/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ КНИГ
	 * @returns Promise<список книг в формате JSON ([{...}, {...}, ...])>
	 */
	getAll() {
		return this._storage.getAll();
	}

	/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ КНИГЕ
	 * @params {string} id - ID книги
	 * @returns Promise<информация о книге в формате JSON {...}>
	 */
	get(id: string) {
		return this._storage.get(Number(id));
	}

	/** ДОБАВЛЕНИЕ НОВОЙ КНИГИ
	 * @constructor
	 * @params {JSON} параметры новой книги (title,description,authors,favorite,fileCover,fileName)
	 * @returns Promise<сам добавленный объект в формате JSON ({...})>
	 */
	create(item: IBookDto) {
		return this._storage.create(item);
	}

	/** ИЗМЕНЕНИЕ ПАРАМЕТРОВ КНИГИ
	 * @constructor
	 * @params {string} id - ID книги
	 * @params {JSON} новые параметры книги (title,description,authors,favorite,fileCover,fileName)
	 * @returns Promise<измененная книга в формате JSON ({...})>
	 */
	update(id: string, item: IBookDto) {
		return this._storage.update(Number(id), item);
	}

	/** УДАЛЕНИЕ ВЫБРАННОЙ КНИГИ
	 * @constructor
	 * @params {String} id   - ID книги
	 * @returns Promise<bool>
	 */
	delete(id: string) {
		return this._storage.delete(Number(id));
	}
}
