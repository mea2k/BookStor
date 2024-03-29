import users from '../models/user.js'
import { UserDb } from "./userDb.js";
import { UserFile } from "./userFile.js";

import CONFIG from "../config.js";
import { sha256wSaltSync } from '../hash.js';

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const defaultFilename = CONFIG.DATA_PATH + CONFIG.USER_FILE


/** КЛАСС - КОНТЕЙНЕР КНИГ
 * сохраняет всю информацию о книгах в файле FILENAME или в БД DBMODEL
 * (имена передаются конструктору, если имен нет - то просто в памяти)
 * МЕТОДЫ КЛАССА:
 *   getAll()  - возвращает все содержимое контейнера
 *   get(id)   - возвращает один объект (книгу) по идентификатору ID 
 *               или undefined, если не найден 
 *   getByLogin(login) - возвращает один объект (книгу) по идентификатору ID 
 *               или undefined, если не найден
 *   add(item) - добавление объекта(книги) в хранилище
 *               возвращает добавленный объект или undefined. ID объекта формируется автоматически
 *   modify(id, item) - изменение содержимого полей объекта(книги) с идентификатором ID.
 *                      Возвращает измененный объект или undefined, если объекта с ID нет
 *   delete(id) - удаление объекта(книгу) с идентификатором ID.
 *                Возвращает 1 в случае успеха или 0, если объект не найден.
 *   verify(login, password) - проверка корректности пароля password 
 *                          для указанного объекта(пользователя) с идентификатором ID.
 *                          Возвращает true или false
 *   _hashPassword(item, rounds = 10) - получение hash-строки от пароля 
 *                                      с использованием сгенерированной "соли".
 *                                        Возвращает {salt, password}
*/
class UserStorage {
    constructor(dbModel = undefined, filename = undefined) {
        this.dbModel = dbModel
        // если не указана модель БД и не указано имя файла,
        // то берется имя файла по умолчанию (defaultFilename)
        this.fileName = (dbModel || filename) ? filename : defaultFilename

        // если работает с файлом - создаем объект BOOKFILE
        if (this.fileName) {
            this.storage = new UserFile(this.fileName)
        }

        // если работаем с БД - создаем объект BOOKDB
        if (this.dbModel) {
            this.storage = new UserDb(this.dbModel)
        }
    }

    getAll() {
        return this.storage.getAll();
    }

    get(id) {
        return this.storage.get(id)
    }
    
    async getByLogin(login) {
        return this.storage.getByLogin(login)
    }

    async add(item) {
        const itemwHash = await this._hashPassword(item)
        return this.storage.add(itemwHash)
    }

    modify(id, item) {
        return this.storage.modify(id, item)
    }

    delete(id) {
        return this.storage.delete(id)
    }

    async verify(login, password) {
        const user = await this.storage.getByLogin(login)
        if (!user)
            return false;

        // проверка паролей
        const passw = await sha256wSaltSync(password, user.salt)
        // пароли не совпадают
        if (passw !== user.password)
            return false
        // все ОК
        else
            return true
    }

    async _hashPassword(item, rounds = 10) {
        const res = await sha256wSaltSync(item.password, rounds)
        item.salt = res.salt
        item.password = res.hash
        return item
    }

}


/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Создание глобального объекта "СПИСОК ПОЛЬЗОВАТЕЛЕЙ"
var userStorage
switch (CONFIG.STORAGE_TYPE) {
    case "file":
        userStorage = new UserStorage()
        break
    case "mongo":
        userStorage = new UserStorage(users)
        break
}

// экспорт не класса, а объекта
export { userStorage }