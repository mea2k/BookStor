// Метка для объекта включения (инъекции зависимости)
export const BOOKCOMMENTS_STORAGE = 'BOOKCOMMENTS_STORAGE';

/** ИНТЕРФЕЙС - КОММЕНТАРИЙ_КНИГИ
 * Определяет информацию для каждого объекта КОММЕНТАРИЙ_КНИГИ:
 *   _id:           number   - ID комментария (обязательный параметр)
 *   bookId:        number   - ID книги (обязательный параметр)
 *   user:          number   - ID пользователя (обязательный параметр)
 *   comment:       string   - текст комментария  (обязательный параметр)
 *   date?:          Date     - дата и время публикации комментария
 *
 * Обязательными являются  поля _id, bookId, user, comment
 */
export interface IBookComment {
	_id: number;
	bookId: number;
	user: number;
	comment: string;  
	date?: Date;
}
	

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_ДОБАВЛЕНИЯ_КОММЕНТАРИЯ
 * Определяет информацию, на основании которой создается объект КОММЕНТАРИЙ_КНИГИ:
 * (берется из формы создания)
 *   comment:       string   - текст комментария (обязательный параметр)
 *
 * Обязательным являются поля bookId, user, comment
 */
export interface IBookCommentDto {
	bookId: IBookComment['bookId'];
	user: IBookComment['user'];
	comment: IBookComment['comment'];
	date?: IBookComment['date'];
}
