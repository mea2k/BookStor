import express from 'express';
import fs from 'fs'


import { JSONError } from '../error.js';
import { bookStorage } from '../bookStorage.js';
import fileMulter from '../middleware/fileMulter.js';
import { Book } from '../book.js';

// нужно, чтобы fetch работал
const API_URL = '/api/books/'
const URL_PREFIX = 'http://'


const booksRouter = express.Router()

/** ОТОБРАЖЕНИЕ СПИСКА ВСЕХ КНИГ
 * URL:     /books 
 * METHOD:  GET
 * @constructor
 * @returns code - 200
 * @returns body - список книг в EJS-шаблоне index.ejs
*/
booksRouter.get('/', (req, res) => {
    // получение данных
    fetch(URL_PREFIX + req.headers?.host + API_URL).then((apiRes) => {
        if (apiRes.ok) {
            apiRes.json().then((data) => {
                res.status(200)
                res.render('pages/books/index', {
                    title: 'Список книг',
                    data
                })
            })
        }
        else {
            res.status(apiRes.status)
            res.render('errors/index', {
                title: apiRes.status,
                data: JSONError.make(apiRes.status, 'Что-то на сервере пошло не так... Обратитесь к администратору!')
            })
        }
    })
})


/** ДОБАВЛЕНИЕ НОВОЙ КНИГИ С ЗАГРУЗКОЙ ФАЙЛА - ФОРМА
 * URL:     /books/add
 * METHOD:  GET
 * @constructor
 * @returns code - 200
 * @returns body - форма добавления книги на базе шаблона books/add_edit.ejs
*/
booksRouter.get('/add', (req, res) => {
    // отображение формы
    res.status(200)
    res.render('pages/books/add_edit', {
        title: 'Добавление книги',
        action: 'Добавить',
        data: {}
    })
})


/** ДОБАВЛЕНИЕ НОВОЙ КНИГИ С ЗАГРУЗКОЙ ФАЙЛА - ОБРАБОТКА ФОРМЫ
 * URL:     /books/add
 * METHOD:  POST
 * @constructor
 * @params {JSON} body - параметры новой книги (title,description,authors,favorite,fileCover,fileName)
 * @params FILE  fileBook - загружаемый на сервер файл (элемент fileBook типа FILE в форме)
 * @returns code - 201 или 403 (если ошибка)
 * @returns none - перенаправляет на список книг ('/books') 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
booksRouter.post('/add', fileMulter.single('fileBook'), (req, res) => {

    const apiUrl = URL_PREFIX + req.headers?.host + API_URL

    let reqBody = req.body

    let { fileBook } = req.body
    let fileName = ''
    if (req.file) {
        fileBook = req.file.path
        fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8') 
        reqBody = { ...reqBody, fileBook, fileName }
    }

    //
    // COPY-PAST из API/BOOKS метод POST
    //

    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
    } = req.body

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
        console.log('Added data:', { ...newBook })
        res.redirect('/books')
    }
    else {
        // данные НЕ добавлены
        res.status(403)
        res.render('errors/index', {
            title: 'Ошибка добавления данных',
            data
        })
    }
})


/** ОТОБРАЖЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ КНИГЕ
 * URL:     /books/:id
 * METHOD:  GET
 * @constructor
 * @params {string} id - ID книги
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns body - информация о книге в EJS-шаблоне book.ejs 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
booksRouter.get('/:id', (req, res) => {
    // получение параметров запроса
    const { id } = req.params
    // получение данных
    const apiUrl = URL_PREFIX + req.headers?.host + API_URL + id
    fetch(apiUrl).then((apiRes) => {
        if (apiRes.ok) {
            apiRes.json().then((data) => {
                res.status(200)
                res.render('pages/books/view', {
                    title: 'Информация о книге ' + data.title,
                    data
                })
            })
        }
        else {
            apiRes.json().then((data) => {
                res.status(apiRes.status)
                res.render('errors/index', {
                    title: apiRes.status,
                    data
                })
            })

        }
    })
})


/** РЕДАКТИРОВАНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ КНИГЕ - ФОРМА
 * URL:     /books/edit/:id
 * METHOD:  GET
 * PARAMS:
 * @constructor
 * @params {String} id   - ID книги
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns none - форма редактирования книги в EJS-шаблоне form.ejs 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
booksRouter.get('/edit/:id', (req, res) => {
    // получение параметров запроса
    const { id } = req.params

    const apiUrl = URL_PREFIX + req.headers?.host + API_URL + id
    fetch(apiUrl).then((apiRes) => {
        if (apiRes.ok) {
            apiRes.json().then((data) => {
                res.status(200)
                res.render('pages/books/add_edit', {
                    title: 'Редактирование информации о книге ' + data.title,
                    action: 'Сохранить',
                    data
                })
            })
        }
        else {
            apiRes.json().then((data) => {
                res.status(apiRes.status)
                res.render('errors/index', {
                    title: apiRes.status,
                    data
                })
            })

        }
    })
})


/** РЕДАКТИРОВАНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ КНИГЕ - СОХРАНЕНИЕ
 * URL:     /books/edit/:id
 * METHOD:  POST
 * PARAMS:
 * @constructor
 * @params {String} id   - ID книги
 * @params {JSON}   body - новые параметры книги (title,description,authors,favorite,fileCover,fileName)
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns none - перенаправляет на страницу книги ('/books/:id') 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
booksRouter.post('/edit/:id', fileMulter.single('fileBook'), (req, res) => {
    // получение параметров запроса
    const { id } = req.params

    const apiUrl = URL_PREFIX + req.headers?.host + API_URL + id
 
    let reqBody = req.body

    let { fileBook } = req.body
    let fileName = ''
    if (req.file) {
        fileBook = req.file.path
        fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8') 
        reqBody = { ...reqBody, fileBook, fileName }
    }

    //
    // COPY-PAST из API/BOOKS метод POST
    //

    // создание нового объекта - Книга
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
    if (req.file) {
        newBookData.fileBook = req.file.path
        newBookData.fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8') 
    }

    //console.log('UPDATE - ' , {id}, {...newBookData})
    
    // выполнение действия с хранилищем - 
    // изменение параметров существующей книги
    const data = bookStorage.modify(id, newBookData)
     if (data) {
        // данные добавлены успешно
        console.log('Updated data:', { ...data })
        res.redirect('/books')
    }
    else {
        // данные НЕ добавлены
        res.status(403)
        res.render('errors/index', {
            title: 'Ошибка изменения данных',
            data
        })
    }
})



/** СКАЧИВАНИЕ ФАЙЛА ДЛЯ ВЫБРАННОЙ КНИГИ
 * URL:     /books/:id/download
 * METHOD:  GET
 * @constructor
 * @params {string} id - ID книги
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns body - содержимое файла 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
booksRouter.get('/:id/download', (req, res) => {
    // получение параметров запроса
    const { id } = req.params

    const apiUrl = URL_PREFIX + req.headers?.host + API_URL + id + '/download'
    res.redirect(apiUrl)
 })


/** УДАЛЕНИЕ ВЫБРАННОЙ КНИГИ
 * URL:     /books/delete/:id
 * METHOD:  POST
 * @constructor
 * @params {String} id   - ID книги
 * @returns code - 200 или 404 (если не найдена книга)
 * @returns none - перенаправляет на страницу списка книг ('/books') 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
booksRouter.post('/delete/:id', (req, res) => {
    // получение параметров запроса
    const { id } = req.params
    // удаление существующей книги
    const headers = {
        method: 'DELETE'
    }

    const apiUrl = URL_PREFIX + req.headers?.host + API_URL + id
    // получение данных
    fetch(apiUrl, headers).then((apiRes) => {
        if (apiRes.ok) {
            res.redirect('/books')
        }
        else {
            apiRes.json().then((data) => {
                res.status(apiRes.status)
                res.render('errors/index', {
                    title: apiRes.status,
                    data
                })
            })
        }
    })
})



// экспорт
export default booksRouter

