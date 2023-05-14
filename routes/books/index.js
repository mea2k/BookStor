import express from 'express';

import { JSONError } from '../../error.js';
import fileMulter from '../../middleware/fileMulter.js';

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
    // вызов API-метода GET /api/books
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

    // перенаправляем запрос на API-метод
    //res.redirect(307, '/api.books').then(data => {
    //    console.log({...data})
    //})

    let { fileBook, fileName } = req.body
    if (req.file) {
        fileBook = req.file.path
        fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
        reqBody = { ...reqBody, fileBook, fileName }
    }

    // вызов API-метода POST api/books
    try {
        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(api_res => {
            if (api_res.ok) {
                // данные добавлены успешно
                api_res.json().then(data => console.log('Added data:', { ...data }))
                res.redirect('/books')
            } else {
                // данные НЕ добавлены
                res.status(403)
                res.render('errors/index', {
                    title: 'Ошибка добавления данных',
                    data: api_res.json().then(data => data)
                })

            }
        })
    }
    catch (error) {
        console.error('Ошибка:', error);
        res.status(403)
        res.render('errors/index', {
            title: 'Ошибка добавления данных',
            data: error
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
    // вызов API-метода GET /api/books/:id
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

    let { fileBook, fileName } = req.body
    if (req.file) {
        fileBook = req.file.path
        fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
        reqBody = { ...reqBody, fileBook, fileName }
    }

    // вызов API-метода PUT api/books/:id
    try {
        fetch(apiUrl, {
            method: 'PUT',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(api_res => {
            if (api_res.ok) {
                // данные добавлены успешно
                api_res.json().then(data => console.log('Updated data:', { ...data }))
                res.redirect('/books')
            } else {
                // данные НЕ добавлены
                res.status(403)
                res.render('errors/index', {
                    title: 'Ошибка изменения данных',
                    data: api_res.json().then(data => data)
                })

            }
        })
    }
    catch (error) {
        console.error('Ошибка:', error);
        res.status(403)
        res.render('errors/index', {
            title: 'Ошибка изменения данных',
            data: error
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

    // вызов API-метода GET /api/books/:id/download
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
    // вызов API-метода DELETE /api/books/:id
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

