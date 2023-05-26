import express from 'express';
import fs from 'fs'
import { counterStorage } from '../counterStorage.js';

const counterAPIRouter = express.Router()

/** ПОЛУЧЕНИЕ ЗНАЧЕНИЯ СЧЕТЧИКА КНИГИ
 * URL:     /api/counter/:bookId 
 * METHOD:  GET
 * @constructor
 * @returns code - 200
 * @returns body - число посещений в формате JSON ({bookId, counter, datetime})
*/
counterAPIRouter.get('/:bookId', (req, res) => {
    // получение параметров запроса
    const { bookId } = req.params
    // получение данных
    const data = counterStorage.get(bookId)
    if (data) {
        // отправка кода ответа
        res.status(200)
        // отправка тела ответа
        res.json(data)
    }
    else {
        res.status(404)
        res.json({
            errcode: 404,
            errmsg: "Книга не найдена"
        })
    }
})


/** УВЕЛИЧЕНИЕ СЧЕТЧИКА КНИГИ
 * URL:     /api/counter/:bookId/inc
 * METHOD:  POST
 * @constructor
 * @returns code - 201 или 403 (если ошибка)
 * @returns body - число посещений в формате JSON ({bookId, counter, datetime})
 *                 или информация об ошибке в формате JSON {"errcode", "errmsg"}
*/
counterAPIRouter.post('/:bookId/inc',  (req, res) => {
    // получение параметров запроса
    const { bookId } = req.params

    // выполнение действия с хранилищем - 
    // добавление новой книги
    const data = counterStorage.inc(bookId)
    if (data) {
        // данные добавлены успешно
        res.status(201)
        res.json(data)
    } else {
        // данные НЕ добавлены
        res.status(403)
        res.json({
            errcode: 403,
            errmsg: 'Что-то на сервере пошло не так... Обратитесь к администратору!'
        })
    }
})


/** УДАЛЕНИЕ СЧЕТЧИКА КНИГИ
 * URL:     /api/counter/:bookId
 * METHOD:  DELETE
 * @constructor
 * @returns code - 200 или 404 (если ошибка)
 * @returns body - '1' при успехе
 *                 или информация об ошибке в формате JSON {"errcode", "errmsg"}
*/
counterAPIRouter.delete('/:bookId', (req, res) => {
    // получение параметров запроса
    const { bookId } = req.params
    // выполнение действия с хранилищем - 
    // удаление существующей книги
    const data = counterStorage.delete(bookId)
    if (data === 0) {
        // данные не удалены - отправка ошибки
        res.status(404)
        res.json({
            errcode: 404,
            errmsg: "Данные не обнаружены"
        })
    } else {
        // данные удалены
        res.status(200)
        res.json({ data: '1' })
    }
})



// экспорт
export default counterAPIRouter

