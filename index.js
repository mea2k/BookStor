import express from 'express';
import { Book } from './book.js';
import { BookStorage } from './bookStorage.js';

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Создание объекта Хранилище книг
const bookStorage = new BookStorage()

// Создание объекта Express.JS
const app = express()
app.use(express.json())

/////////////////////////////////////////////////
/////////////////////////////////////////////////

/////////////////////////////////////////////////
// АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЕЙ
// URL:     /api/user/login
// METHOD:  POST
// PARAMS:
//   none
// RETURN
//   code - 201
//   body - { id: 1, mail: "test@mail.ru" } (заглушка)
/////////////////////////////////////////////////
app.post('/api/user/login', (req, res) => {
    // данные - заглушка
    const data = { id: 1, mail: "test@mail.ru" }
    // отправка кода ответа
    res.status(201)
    // отправка тела ответа
    res.json(data)
})

/////////////////////////////////////////////////
// ПОЛУЧЕНИЕ СПИСКА ВСЕХ КНИГ
// URL:     /api/books
// METHOD:  GET
// PARAMS:
//   none
// RETURN
//   code - 200
//   body - список книг ([{...}, {...}, ...])
/////////////////////////////////////////////////
app.get('/api/get', (req, res) => {
    // получение данных
    const data = bookStorage.getAll()
    // отправка кода ответа
    res.status(200)
    // отправка тела ответа
    res.json(data)
})

/////////////////////////////////////////////////
// ПОЛУЧЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ КНИГЕ
// URL:     /api/books/:id
// METHOD:  GET
// PARAMS:
//   id - ID книги
// RETURN
//   code - 200 или 404 (если не найдена книга)
//   body - информация о книге {...} или пусто {}
/////////////////////////////////////////////////
app.get('/api/get/:id', (req, res) => {
    // получение параметров запроса
    const { id } = req.params
    // получение данных
    const data = bookStorage.get(id)
    if (data === undefined) {
        // данные не найдены - отправка ошибки
        res.status(404)
        res.json({})
    } else {
        // данные найдены - отправка результата
        res.status(200)
        res.json(data)
    }
})

/////////////////////////////////////////////////
// ДОБАВЛЕНИЕ НОВОЙ КНИГИ
// URL:     /api/books
// METHOD:  POST
// PARAMS:
//   body - параметры новой книги (title,description,authors,favorite,fileCover,fileName)
// RETURN
//   code - 200 или 403 (если ошибка)
//   body - сам добавленный объект ({...})
/////////////////////////////////////////////////
app.post('/api/get', (req, res) => {
    // получение данных из тела POST-запроса
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body

    // создание нового объекта - Книга
    const newBook = new Book(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
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
        res.json('Что-то на сервере пошло не так... Обратитесь к администратору!')
    }
})

/////////////////////////////////////////////////
// РЕДАКТИРОВАНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ КНИГЕ
// URL:     /api/books/:id
// METHOD:  PUT
// PARAMS:
//   id - ID книги
//   body - новые параметры книги (title,description,authors,favorite,fileCover,fileName)
// RETURN
//   code - 200 или 404 (если не найдена книга)
//   body - информация о книге {...} или пусто {}
/////////////////////////////////////////////////
app.put('/api/get/:id', (req, res) => {
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
    if (req.body.fileName)
        newBookData.fileName = req.body.fileName
    // выполнение действия с хранилищем - 
    // изменение параметров существующей книги
    const data = bookStorage.modify(id, newBookData)
    if (data === undefined) {
        // данные не изменены - отправка ошибки
        res.status(404)
        res.json({})
    } else {
        // данные изменены - отправка результата
        res.status(200)
        res.json(data)
    }
})

/////////////////////////////////////////////////
// УДАЛЕНИЕ ВЫБРАННОЙ КНИГИ
// URL:     /api/books/:id
// METHOD:  DELETE
// PARAMS:
//   id - ID книги
// RETURN
//   code - 200 или 404 (если не найдена книга)
//   body - 'ok' или пусто
/////////////////////////////////////////////////
app.delete('/api/get/:id', (req, res) => {
    // получение параметров запроса
    const { id } = req.params
    // выполнение действия с хранилищем - 
    // удаление существующей книги
    const data = bookStorage.delete(id)
    if (data === 0) {
        // данные не удалены - отправка ошибки
        res.status(404)
        res.json({})
    } else {
        // данные удалены
        res.status(200)
        res.json('ok')
    }
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
const PORT = process.env.PORT || 3000
app.listen(PORT)