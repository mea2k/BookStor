import express from 'express'
import passport from 'passport'
import { userStorage } from '../users/userStorage.js'
import { JSONError } from '../error.js'


const usersRouter = express.Router()


/** СТРАНИЦА ФОРМЫ ВХОДА ПОЛЬЗОВАТЕЛЯ
 * URL:     /user/login
 * METHOD:  GET
 * @constructor 
 * @returns code - 200
 * @returns body - форма регистрации/входа на базе шаблона pages/logreg_form.ejs
*/
usersRouter.get('/login', (req, res) => {
    // отображение формы
    res.status(200)
    res.render('pages/users/logreg_form', {
        title: 'Авторизация',
        action: 'Войти',
        user: req.user,
        data: {}
    })
})


/** АУТЕНТИФИКАЦИЯ ПОЛЬЗОВАТЕЛЯ
 * URL:     /user/login
 * METHOD:  POST
 * @constructor
 * @params {JSON} body - параметры входа ({login, password})
 * @returns code - 202 или 403 (если ошибка)
 * @returns none - перенаправляет на главную страницу ('/') 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
usersRouter.post('/login',
    // middleware - проверка аутентификации
    passport.authenticate('local', {
        /* successRedirect: '/',*/
        failureRedirect: '/user/login',
        failureMessage: 'Неверное имя пользователя или пароль'
    }),
    // основной обработчик
    (req, res) => {
        const data = req.body
        const user = req.user
        console.log('LOGIN: ', user)
        res.status(202)
        res.redirect('/')
    })


/** СТРАНИЦА ФОРМЫ РЕГИСТРАЦИИ ПОЛЬЗОВАТЕЛЯ
 * URL:     /user/signup
 * METHOD:  GET
 * @constructor 
 * @returns code - 200
 * @returns body - форма регистрации/входа на базе шаблона pages/logreg_form.ejs
*/
usersRouter.get('/signup',
    // middleware - проверка, что уже зарегистрирован
    (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/user/me')
        }
        next()
    },
    // основной обработчик
    (req, res) => {
        // отображение формы
        res.status(200)
        res.render('pages/users/logreg_form', {
            title: 'Регистрация',
            action: 'Зарегистрироваться',
            user: {},
            data: {
                newUser: true
            }
        })
    })


/** РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
 * URL:     /user/signup
 * METHOD:  POST
 * @constructor
 * @params {JSON} body - параметры нового пользователя 
 *                      ({login, password, password2, name, email})
 * @returns code - 201 или 403 (если ошибка)
 * @returns none - перенаправляет на главную страницу ('/') 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
usersRouter.post('/signup',
    // middleware - проверка, что уже зарегистрирован
    (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/user/me')
        }
        next()
    },
    // основной обработчик
    (req, res) => {
        const { login, name, email, password, password2 } = req.body
        var errors
        // проверка, что все поля заполнены
        if (!login)
            errors.login = "Логин не может быть пустым"
        if (!name)
            errors.name = "Имя не может быть пустым"
        if (!email)
            errors.email = "Email не может быть пустым"
        if (!password || !password2)
            errors.password = "Пароль не может быть пустым"
        // проверка, что пароли совпадают
        if (password && password2 && (password !== password2))
            errors.password = "Пароли не совпадают"

        // если есть ошибки - перенаправляем обратно на форму регистрации
        if (errors) {
            console.log('here')
            res.render('pages/users/logreg_form', {
                title: 'Регистрация',
                action: 'Зарегистрироваться',
                user: { login, name, email, password, password2 },
                data: {
                    newUser: true
                },
                errors
            })
        }

        const newUser = {
            login,
            name,
            email,
            password
        }
        // вызов метода хранилища
        userStorage.add(newUser).then((data) => {
             if (data) {
                console.log('SAVED - ', data)
                res.status(201)
                res.redirect('/')
            }
            else {
                res.status(403)
                res.render('errors/index', {
                    title: 'Ошибка регистрации',
                    data: JSONError.err403('Ошибка регистрации')
                })
            }
        })
    })


/** ОТОБРАЖЕНИЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
 * URL:     /user/me
 * METHOD:  GET
 * @constructor
 * @params {string} id - ID пользователя (берется из сессии)
 * @returns code - 200 или 404 (если не тот пользователь)
 * @returns body - информация о пользователе в EJS-шаблоне profile.ejs 
 *                 или страница с ошибкой на базе шаблона errors/index.ejs
*/
usersRouter.get('/me',
    // middleware - проверка, что уже аутентифицирован
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/user/login')
        }
        next()
    },
    // основной обработчик
    (req, res) => {
        // получение параметров запроса
        const id = req.user._id.toString()
        // получение данных из хранилища
        userStorage.get(id).then((user) => {
            if (user) {
                res.status(200)
                res.render('pages/users/profile', {
                    title: 'Информация о пользователе ' + user.login,
                    data: {},
                    user
                })
            } else {
                res.status(404)
                res.render('errors/index', {
                    title: "Пользователь не найден",
                    data: JSONError.err403("Пользователь не найден")
                })
            }
        })
    })


/** ВЫХОД ИЗ СИСТЕМЫ
* URL:     /user/logout
* METHOD:  GET
* @constructor
* @returns REDIRECT на главную страницу ('/')
*/
usersRouter.get('/logout',
    (req, res) => {
        req.logout((err, next) => {
            if (err) { return next(err); }
            res.redirect('/');
        })
    })




// экспорт
export default usersRouter

