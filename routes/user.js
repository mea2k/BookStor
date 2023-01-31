import express from 'express';

const userRouter = express.Router()


/** АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЕЙ
 * URL:     /api/user/login
 * METHOD:  POST
 * @constructor 
 * @returns code - 201
 * @returns body - { id: 1, mail: "test@mail.ru" } (заглушка)
*/
userRouter.post('/login', (req, res) => {
    // данные - заглушка
    const data = { id: 1, mail: "test@mail.ru" }
    // отправка кода ответа
    res.status(201)
    // отправка тела ответа
    res.json(data)
})


// экспорт
export default userRouter

