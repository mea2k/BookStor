import express from 'express';
import fs from 'fs'


import { JSONError } from '../error.js';
import { bookStorage } from '../bookStorage.js';
import fileMulter from '../middleware/fileMulter.js';

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
booksRouter.post('/add', (req, res) => {

    console.log('POST-ADD')
    const apiUrl = URL_PREFIX + req.headers?.host + API_URL
    const headers = {
        //'hostname': req.headers.host,
        'method': 'POST',
        'path': API_URL,
        'headers': {
            'json': true,
            'Content-Type': 'application/json',
        },
        'body': JSON.stringify({ ...req.body }),
    }

    fetch(apiUrl, headers).then((apiRes) => {
        if (apiRes.ok) {
            // данные добавлены
            apiRes.json().then((data) => {
                console.log('Added data:')
                console.log({ ...data })
                res.redirect('/books')
            })
        } else {
            // данные НЕ добавлены
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
booksRouter.post('/edit/:id', (req, res) => {
    // получение параметров запроса
    const { id } = req.params

    const apiUrl = URL_PREFIX + req.headers?.host + API_URL + id
    const headers = {
        'hostname': req.headers?.host,
        'method': 'PUT',
        'path': API_URL + id,
        'headers': {
            'json': true,
            'Content-Type': 'application/json',
        },
        'body': JSON.stringify({ id, ...req.body }),
    }
    fetch(apiUrl, headers).then((apiRes) => {
        if (apiRes.ok) {
            // данные обновлены
            res.redirect('/books/' + id)
        } else {
            // данные НЕ обновлены
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
    fetch(apiUrl).then((apiRes) => {
        if (apiRes.ok) {
            apiRes.data().then((data) => {
                res.status(200)
                res.download(data)
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
    console.log(apiUrl)
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

