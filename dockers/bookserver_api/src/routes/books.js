import express from 'express';
import fs from 'fs'

import { bookStorage } from '../bookStorage.js';
import { Book } from '../book.js';
import { JSONError } from '../error.js';
import fileMulter from '../middleware/fileMulter.js';



const booksAPIRouter = express.Router()

/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ КНИГ
 * URL:     /api/books 
 * METHOD:  GET
 * @constructor
 * @returns code - 200
 * @returns body - список книг в формате JSON ([{...}, {...}, ...])
*/
booksAPIRouter.get('/', (req, res) => {
    // получение данных
    const data = bookStorage.getAll()
    // отправка кода ответа
    res.status(200)
    // отправка тела ответа
    res.json(data)
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
booksAPIRouter.get('/:id', (req, res) => {
    // получение параметров запроса
    const { id } = req.params
    // получение данных
    const data = bookStorage.get(id)
    if (data === undefined) {
        // данные не найдены - отправка ошибки
        res.status(404)
        res.json(JSONError.err404())
    } else {
        // данные найдены - отправка результата
        res.status(200)
        res.json(data)
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
booksAPIRouter.post('/', fileMulter.single('fileBook'), (req, res) => {
    // получение данных из тела POST-запроса
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
    } = req.body

    // загрузка файла
    // и сохранение оригинального имени (fileName)
    // fileBook - сгенерированное имя файла на сервере
    let { fileBook, fileName } = req.body
    if (req.file) {
        fileBook = req.file.path
        fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
    }

    // создание нового объекта - Книга
    const newBook = new Book(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook
    )

    // выполнение действия с хранилищем - 
    // добавление новой книги
    const data = bookStorage.add(newBook)
    if (data > 0) {
        // данные добавлены успешно
        res.status(201)
        res.json(newBook)
    } else {
        // данные НЕ добавлены
        res.status(403)
        res.json(JSONError.err403('Что-то на сервере пошло не так... Обратитесь к администратору!'))
    }
})


/** РЕДАКТИРОВАНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ КНИГЕ
 * URL:     /api/books/:id
 * METHOD:  PUT
 * PARAMS:
 * @constructor
 * @params {String} id   - ID книги
 * @params {JSON}   body - новые параметры книги (title,description,authors,favorite,fileCover,fileName)
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns body - информация о книге в формате JSON {...}
 *                 или информация об ошибке в формате JSON {"errcode", "errmsg"}
*/
booksAPIRouter.put('/:id', fileMulter.single('fileBook'), (req, res) => {
    // получение параметров запроса
    const { id } = req.params
    // получение данных из тела PUT-запроса
    // и создание нового объекта с новыми значениями параметров

    let newBookData = {}
    if (req.body.title)
        newBookData.title = req.body.title
    if (req.body.description)
        newBookData.description = req.body.description
    if (req.body.authors)
        newBookData.authors = req.body.authors
    if (req.body.favorite)
        newBookData.favorite = req.body.favorite
    if (req.body.fileCover)
        newBookData.fileCover = req.body.fileCover
    if (req.body.fileBook)
        newBookData.fileBook = req.body.fileBook
    if (req.body.fileName)
        newBookData.fileName = req.body.fileName
    if (req.file) {
        newBookData.fileBook = req.file.path
        newBookData.fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
    }

    // выполнение действия с хранилищем - 
    // изменение параметров существующей книги
    const data = bookStorage.modify(id, newBookData)
    if (data === undefined) {
        // данные не изменены - отправка ошибки
        res.status(404)
        res.json(JSONError.err404())
    } else {
        // данные изменены - отправка результата
        res.status(200)
        res.json(data)
    }
})


/** ДОБАВЛЕНИЕ ФАЙЛА ДЛЯ ВЫБРАННОЙ КНИГИ
 * URL:     /api/books/:id/upload
 * METHOD:  POST
 * @constructor
 * @params {multipart-formdata} fileBook - загружаемый файл
 * @returns code - 201 или 403 или 404 (если ошибка)
 * @returns body - измененный объект с именем добавленного файла в формате JSON ({...}) 
 *                 или информация об ошибке в формате JSON {"errcode", "errmsg"}
*/
booksAPIRouter.post('/:id/upload', fileMulter.single('fileBook'), (req, res) => {
    // получение параметров запроса
    const { id } = req.params

    const data = bookStorage.get(id)
    if (data === undefined) {
        // данные не найдены - отправка ошибки
        res.status(404)
        res.json(JSONError.err404())
    } else {
        // данные найдены - обновление данных
        // и сохранение оригинального имени (fileName)
        // fileBook - сгенерированное имя файла на сервере
        let fileBook = ''
        let fileName = ''
        if (req.file) {
            fileBook = req.file.path
            fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
        }

        const newData = {
            ...data,
            fileName,
            fileBook
        }
        const result = bookStorage.modify(id, newData)
        if (result === undefined) {
            // данные не изменены - отправка ошибки
            res.status(403)
            res.json(JSONError.err403())
        } else {
            // данные изменены - отправка результата
            res.status(200)
            res.json(result)
        }
    }
})


/** СКАЧИВАНИЕ ФАЙЛА ДЛЯ ВЫБРАННОЙ КНИГИ
 * URL:     /api/books/:id/download
 * METHOD:  GET
 * @constructor
 * @params {string} id - ID книги
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns body - содержимое файла 
 *                 или информация об ошибке в формате JSON {"errcode", "errmsg"}
*/
booksAPIRouter.get('/:id/download', (req, res) => {
    // получение параметров запроса
    const { id } = req.params

    const data = bookStorage.get(id)
    if (data === undefined) {
        // данные не найдены - отправка ошибки
        res.status(404)
        res.json(JSONError.err404())
    } else {
        // данные найдены - обновление данных
        const { fileBook, fileName } = data
        res.status(200)
        // отправляем файл через метод res.download
        // и указываем оригинальное имя файла
        res.download(fileBook, fileName, (err, data) => {
            //fs.readFile(fileBook, 'utf8', (err, data) => {
            if (err) {
                res.status(404)
                res.json(JSONError.err404('Ошибка чтения файла'))
            }
            //     else {
            //         res.status(200)
            //         res.send(fileBook)
            //     }
        })
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
booksAPIRouter.delete('/:id', (req, res) => {
    // получение параметров запроса
    const { id } = req.params
    // выполнение действия с хранилищем - 
    // удаление существующей книги
    const data = bookStorage.delete(id)
    if (data === 0) {
        // данные не удалены - отправка ошибки
        res.status(404)
        res.json(JSONError.err404())
    } else {
        // данные удалены
        res.status(200)
        res.json({ data: 'ok' })
    }
})



// экспорт
export default booksAPIRouter

