import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { BOOKCOMMENTS_STORAGE, IBookCommentDto } from './bookcomments.interfaces';
import { BookCommentStorageFile } from './storage/bookCommentsStorageFile';

@Injectable()
export class BookCommentsService {
	constructor(
		config: ConfigService,
		@Inject(BOOKCOMMENTS_STORAGE)
		private readonly _storage: BookCommentStorageFile,
	) {
		//console.log('BOOKCOMMENTS_SERVICE - constructor');
	}

	/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ КОММЕНТАРИЕВ
	 * @returns Promise<список комментариев в формате JSON ([{...}, {...}, ...])>
	 */
	getAll() {
		return this._storage.getAll();
	}

	/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОМУ КОММЕНТАРИЮ
	 * @params {string} id - ID комментария
	 * @returns Promise<информация о комментарии в формате JSON {...}>
	 */
	get(id: string) {
		return this._storage.get(Number(id));
	}

	/** ДОБАВЛЕНИЕ НОВОГО КОММЕНТАРИЯ
	 * @constructor
	 * @params {JSON} параметры нового комментария IBookComment (bookId,user,comment,date?)
	 * @returns Promise<сам добавленный объект в формате JSON ({...})>
	 */
	create(item: IBookCommentDto) {
		return this._storage.create(item);
	}

	/** ИЗМЕНЕНИЕ ПАРАМЕТРОВ КОММЕНТАРИЯ
	 * @constructor
	 * @params {string} id - ID комментария
	 * @params {JSON} новые параметры комментария IBookCommentDto (comment)
	 * @returns Promise<измененный объект в формате JSON ({...})>
	 */
	update(id: string, item: IBookCommentDto) {
		return this._storage.update(Number(id), item);
	}

	/** УДАЛЕНИЕ ВЫБРАННОГО КОММЕНТАРИЯ
	 * @constructor
	 * @params {String} id   - ID комментария
	 * @returns Promise<bool>
	 */
	delete(id: string) {
		return this._storage.delete(Number(id));
	}

	/** ПОИСК ВСЕХ КОММЕНТАРИЕВ ПО КНИГЕ
	 * @constructor
	 * @params {String} id   - ID книги
	 * @returns Promise<список комментариев в формате JSON ([{...}, {...}, ...])>
	 */
	findAllBookComment(id: string) {
		return this._storage.findAllBookComment(Number(id));
	}
}
