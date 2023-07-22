import { Router, Request, Response } from 'express';
import multer from 'multer'

import { IBook, IBookDto } from '../interfaces/book';
import { BookStorageDb } from '../container/books/bookStorageDb';
import { BookStorageFile } from '../container/books/bookStorageFile';
import { iocContainer } from '../container/container';
import { JSONError } from '../interfaces/error';
import { fileMulter } from '../middleware/fileMulter';
import CONFIG from '../config';


// Тип хранилища
const storageType = process.env.STORAGE_TYPE || CONFIG.STORAGE_TYPE || "file"

/** ПОЛУЧЕНИЕ ХРАНИЛИЩА КНИГ ИЗ IOC-КОНТЕЙНЕРА
 * Зависит от параметра PROCESS.ENV.STORAGE_TYPE или из CONFIG.JSON 
 *   mongo - возвращает контейнер на основе СУБД Mongo (BookStorageDb)
 *   file  - возвращает контейнер на основе файла JSON (BookStorageFile)
**/
function getBookStorage() {
    if (storageType === "mongo")
        return iocContainer.get(BookStorageDb)
    else
        return iocContainer.get(BookStorageFile)
}


// Объект - обработик URL-путей (/api/...)
const booksAPIRouter = Router()


/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ КНИГ
 * URL:     /api/books 
 * METHOD:  GET
 * @constructor
 * @returns code - 200
 * @returns body - список книг в формате JSON ([{...}, {...}, ...])
*/
booksAPIRouter.get('/', async (req: Request, res: Response) => {
    // получение хранилища книг из IOC-контейнера
    const bookStorage = getBookStorage()
    // получение данных
    try {
        bookStorage.getAll().then((data) =>
            // отправка кода ответа и самого ответа
            res.status(200).json(data)
        )
    } catch (e) {
        res.status(500).json(JSONError.make(500, 'Ошибка получения записей из ' + storageType === 'mongo' ? 'БД' : 'файла'))
    }
})


/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ КНИГЕ
 * URL:     /api/books/:id
 * METHOD:  GET
 * @constructor
 * @params {string} id - ID книги
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns body - информация о книге в формате JSON {...} 
 *                 или информация об ошибке в формате JSON {"errcode", "errmsg"}
*/
booksAPIRouter.get('/:id', async (req: Request, res: Response) => {
    // получение параметров запроса
    const { id } = req.params

    // получение хранилища книг из IOC-контейнера
    const bookStorage = getBookStorage()

    // получение данных
    try {
        const data = await bookStorage.get(Number(id))
        if (data === undefined || data === null) {
            throw new Error('Данные не найдены')
        }
        // отправка кода ответа и найденные данные
        res.status(200).json(data)
    } catch (e: unknown) {
        let errorMsg = ''
        if (typeof e === "string") {
            errorMsg = e
        } else if (e instanceof Error) {
            errorMsg = e.message
        }
        res.status(404).json(JSONError.err404(errorMsg))
    }
})


/** ДОБАВЛЕНИЕ НОВОЙ КНИГИ С ЗАГРУЗКОЙ ФАЙЛА
 * URL:     /api/books
 * METHOD:  POST
 * @constructor
 * @params {JSON} body - параметры новой книги (title,description,authors,favorite,fileCover,fileName)
 * @params FILE  fileBook - загружаемый на сервер файл (элемент fileBook типа FILE в форме)
 * @returns code - 201 или 403 (если ошибка)
 * @returns body - сам добавленный объект в формате JSON ({...}) 
 *                 или информация об ошибке в формате JSON {"errcode", "errmsg"}
*/
//TODO: без ANY не работает
booksAPIRouter.post('/',
    fileMulter,
    async (req: Request, res: Response) => {
        // получение данных из тела POST-запроса
        const {
            title,
            description,
            authors
        } = req.body

        // загрузка файлов
        // и сохранение оригинального имени (fileName)
        // fileBook - сгенерированное имя файла книжки на сервере
        // fileCover - сгенерированное имя файла обложки на сервере
        let { fileBook, fileCover } = req.body
        if (req.files) {
            const files = Object.assign(req.files)
            fileBook = files.fileBook[0]
            fileCover = files.fileCover[0]
            //fileName = Buffer.from(req.files.fileBook[0].originalname, 'latin1').toString('utf8')
            //fileName = req.body.title;
        }

        // получение хранилища книг из IOC-контейнера
        const bookStorage = getBookStorage()

        // создание нового объекта - Книга
        const newBook: IBookDto = {
            title,
            description,
            authors,
            fileCover,
            fileBook
        }

        try {
            console.log(newBook)
            bookStorage.create(newBook).then((data) =>
                // отправка кода ответа и информацию о добавленной книге
                res.status(201).json(data)
            )
        } catch (e: unknown) {
            let errorMsg = ''
            if (typeof e === "string") {
                errorMsg = e
            } else if (e instanceof Error) {
                errorMsg = e.message
            }
            res.status(404).json(JSONError.err404(errorMsg))
        }
    })


/** УДАЛЕНИЕ ВЫБРАННОЙ КНИГИ
 * URL:     /api/books/:id
 * METHOD:  DELETE
 * @constructor
 * @params {String} id   - ID книги
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns body - 'ok'
 *                 или информация об ошибке в формате JSON {"errcode", "errmsg"}
*/
booksAPIRouter.delete('/:id', async (req, res) => {
    // получение параметров запроса
    const { id } = req.params

    // получение хранилища книг из IOC-контейнера
    const bookStorage = getBookStorage()

    try {
        // удаление существующей книги
        const data = await bookStorage.delete(Number(id))
        if (data) {
            // отправка кода ответа и тела ответа
            res.status(200).json({ data: 'ok' })
        } else {
            throw new Error('Данные не найдены')
        }
    }
    catch (e: unknown) {
        let errorMsg = ''
        if (typeof e === "string") {
            errorMsg = e
        } else if (e instanceof Error) {
            errorMsg = e.message
        }
        res.status(404).json(JSONError.err404(errorMsg))
    }
})


// экспорт
export default booksAPIRouter

