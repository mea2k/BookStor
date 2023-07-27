import fs from 'fs'
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { IBook, IBookDto } from "../../interfaces/book";
import { StorageFile } from "../storageFile";
import CONFIG from "../../config";


/////////////////////////////////////////////////

const DATA_PATH = process.env.DATA_PATH || CONFIG.DATA_PATH || 'data/'
const BOOKS_FILE = process.env.BOOKS_FILE || CONFIG.BOOKS_FILE || 'books.json'


/////////////////////////////////////////////////
// Проверка на существование пути и создание его
if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH, { recursive: true });
}
/////////////////////////////////////////////////


@injectable()
class BookStorageFile extends StorageFile<IBook, IBookDto, "_id"> {
    constructor() {
        super(DATA_PATH + BOOKS_FILE,"_id")
    }

    _getNextId(id: IBook["_id"]) {  // number
        if (id)
            return id + 1
        return 1
    }

}

// экспорт класса
export { BookStorageFile }