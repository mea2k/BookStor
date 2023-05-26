import express from 'express';

import books from '../models/books.js'
import { JSONError } from '../error.js';
import fileMulter from '../middleware/fileMulter.js';
import globalCounter from './counter.js';



const booksAPIRouter = express.Router()

/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ КНИГ
 * URL:     /api/books 
 * METHOD:  GET
 * @constructor
 * @returns code - 200
 * @returns body - список книг в формате JSON ([{...}, {...}, ...])
*/
booksAPIRouter.get('/', async (req, res) => {
    // получение данных
    try {
        const data = await books.find().select('-__v')
        // отправка кода ответа
        res.status(200)
        // отправка тела ответа
        res.json(data)
    } catch (e) {
        res.status(500)
        res.json(JSONError.err500('Ошибка получения записей из БД'))
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
booksAPIRouter.get('/:id', async (req, res) => {
    // получение параметров запроса
    const { id } = req.params
    // получение данных
    try {
        const data = await books.findById(id).select('-__v')
        if (data === undefined || data === null) {
            throw new Error('Данные не найдены')
        }
        // отправка кода ответа
        res.status(200)
        // отправка тела ответа
        res.json(data)
    } catch (e) {
        res.status(404)
        res.json(JSONError.err404(e.message))
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
booksAPIRouter.post('/', fileMulter.single('fileBook'), async (req, res) => {
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
    const newBook = new books({
        _id: await globalCounter.next(),
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook
    })

    try {
        console.log(newBook)
        await newBook.save()
        const addedData = await books.findById(newBook._id).select('-__v')
        console.log(addedData)
        // отправка кода ответа
        res.status(201)
        // отправка тела ответа
        res.json(addedData)
    } catch (e) {
        res.status(403)
        res.json(JSONError.err403(e.message))
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
booksAPIRouter.put('/:id', fileMulter.single('fileBook'), async (req, res) => {
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

    try {
        const data = await books.findByIdAndUpdate(id, newBookData)
        // получение обновленных данных
        const updatedData = await books.findById(id).select('-__v')
        // отправка кода ответа
        res.status(200)
        // отправка тела ответа
        res.json(updatedData)
    } catch (e) {
        res.status(404)
        res.json(JSONError.err404(e.message))
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

    try {
        // удаление существующей книги
        const data = await books.findByIdAndDelete(id)
        if (data) {
            // отправка кода ответа
            res.status(200)
            // отправка тела ответа
            res.json({ data: 'ok' })
        } else {
            throw new Error('Данные не найдены')
        }
    } catch (e) {
        res.status(404)
        res.json(JSONError.err404(e.message))
    }
})


// экспорт
export default booksAPIRouter

