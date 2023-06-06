import CONFIG from "../config.js";
import { BookDb } from "./bookDB.js";
import { BookFile } from "./bookFile.js";

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const defaultFilename = CONFIG.DATA_PATH + CONFIG.DATA_FILE 


/** КЛАСС - КОНТЕЙНЕР КНИГ
 * сохраняет всю информацию о книгах в файле FILENAME или в БД DBMODEL
 * (имена передаются конструктору, если имен нет - то просто в памяти)
 * МЕТОДЫ КЛАССА:
 *   getAll()  - возвращает все содержимое контейнера
 *   get(id)   - возвращает один объект (книгу) по идентификатору ID 
 *               или undefined, если не найден 
 *   add(item) - добавление объекта(книги) в хранилище
 *               возвращает добавленный объект или undefined. ID объекта формируется автоматически
 *   modify(id, item) - изменение содержимого полей объекта(книги) с идентификатором ID.
 *                      Возвращает измененный объект или undefined, если объекта с ID нет
 *   delete(id) - удаление объекта(книгу) с идентификатором ID.
 *                Возвращает 1 в случае успеха или 0, если объект не найден.
 * 
*/
class BookStorage {
    constructor(dbModel = undefined, filename = undefined) {
        this.dbModel = dbModel
        this.fileName = (dbModel || filename) ? filename : defaultFilename 

        // если работает с файлом - создаем объект BOOKFILE
        if (this.fileName) {
            this.storage = new BookFile(this.fileName)
        }

        // если работаем с БД - создаем объект BOOKDB
        if (this.dbModel) {
            this.storage = new BookDb(this.dbModel)
        }
    }

    getAll() {
        return this.storage.getAll();
    }

    get(id) {
        return this.storage.get(id)
    }

    add(item) {
        return this.storage.add(item)
    }

    modify(id, item) {
        return this.storage.modify(id, item)
    }

    delete(id) {
        return this.storage.delete(id)
    }

}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Создание глобального объекта "ХРАНИЛИЩЕ КНИГ"
const bookStorage = new BookStorage()

// экспорт не класса, а объекта
export { bookStorage }