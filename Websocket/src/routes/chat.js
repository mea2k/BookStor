import express from 'express';

import { JSONError } from '../error.js';
import passport from 'passport';


const chatRouter = express.Router()

/** ОТОБРАЖЕНИЕ СТРАНИЦЫ ЧАТА
 * URL:     /chat
 * METHOD:  GET
 * @constructor
 * @returns code - 200
 * @returns body - страница чата в EJS-шаблоне chat/index.ejs
*/
chatRouter.get('/',
    // middleware - проверка, что уже аутентифицирован
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/user/login')
        }
        next()
    },
    // основной обработчик
    (req, res) => {
        const data = {}
        const user = req.user
        res.status(200)
        res.render('pages/chat/index', {
            title: 'Книжный чат',
            data,
            user
        })
    })





// экспорт
export default chatRouter

