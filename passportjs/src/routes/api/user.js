import express from 'express';
import users from '../../models/user.js'
import { JSONError } from '../../error.js';

const userApiRouter = express.Router()


/** АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЕЙ
 * URL:     /api/user/login
 * METHOD:  POST
 * @constructor 
 * @returns code - 202 ИЛИ 403, если не пройдена аутентификация
 * @returns body - объект USER, если аутентификация прошла успешно,
 *  иначе NULL
*/
// userApiRouter.post('/login', (req, res) => {
//     // данные - заглушка
//     const data = req.body
//     // отправка кода ответа
//     res.status(202)
//     // отправка тела ответа
//     res.json(data)
// })


/** ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
 * URL:     /api/user/signup
 * METHOD:  POST
 * @constructor 
 * @returns code - 201 ИЛИ 403, если ошибка
 * @returns body - новый объект USER, если регистрация прошла успешно,
 *  иначе NULL
*/
userApiRouter.post('/signup', (req, res) => {
    const { login, name, email, password } = req.body

    const newUser = new users({
        login,
        name,
        email,
        password
    })
    try {
         newUser.save().then((addedUser) => {
            console.log('SAVED - ', addedUser)
            // отправка кода ответа
            res.status(201)
            // отправка тела ответа
            res.json(addedUser)
        })
    } catch (e) {
        res.status(403)
        res.json(JSONError.err403(e.message))
    }
})



/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ О ПОЛЬЗОВАТЕЛЕ
 * URL:     /api/user/:id
 * METHOD:  GET
 * @constructor 
 * @returns code - 200 ИЛИ 404, если ошибка
 * @returns body - объект USER, если найден,
 *  иначе NULL
*/
userApiRouter.get('/:id', async (req, res) => {
    // параметры запроса
    const { id } = req.params
     try {
        const data = await users.findById(id)
        if (data) {
            // отправка кода ответа
            res.status(200)
            // отправка тела ответа
            res.json(data)
        } else {
            res.status(404)
            res.json(JSONError.err403("Пользователь не найден"))
        }
    } catch (e) {
        res.status(403)
        res.json(JSONError.err403(e.message))
    }

})



// экспорт
export default userApiRouter

