// Метка для объекта включения (инъекции зависимости)
export const USERS_STORAGE = 'USERS_STORAGE';

/** ИНТЕРФЕЙС - ПОЛЬЗОВАТЕЛЬ
 * Определяет информацию для каждого объекта ПОЛЬЗОВАТЕЛЬ:
 *   _id:           number  - ID  (обязательный параметр)
 *   email:         string  - email пользователя (обязательный параметр)
 *   login:         string  - логин пользователя (обязательный параметр)
 *   firstName?:    string  - имя пользователя
 *
 * Обязательным является только поля ID, email и login
 */
export interface IUSer {
	_id: number;
	email: string;
	login: string;
	firstName?: string;
	password?: string;
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_СОЗДАНИЯ_ПОЛЬЗОВАТЕЛЯ
 * Определяет информацию, на основании которой создается объект ПОЛЬЗОВАТЕЛЬ:
 * (берется из формы создания)
 *   email:      string   - email пользователя (обязательный параметр)
 *   login:      string   - логин пользователя (обязательный параметр)
 *   firstName?: string   - имя пользователя
 *
 * Обязательным является только поля email, login, password
 */
export interface IUSerDto {
	email: IUSer['email'];
	login: IUSer['login'];
	firstName?: IUSer['firstName'];
	password: IUSer['password'];
}
