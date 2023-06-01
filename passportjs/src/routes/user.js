import express from 'express'
import passport from 'passport'


// нужно, чтобы fetch работал
const API_URL = '/api/user/'
const URL_PREFIX = 'http://'


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
    passport.authenticate('local', { failureRedirect: '/user/login' }),
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

        if (password !== password2)
            res.render('errors/index', {
                title: apiRes.status,
                data
            })

        const newUser = {
            login,
            name,
            email,
            password
        }
        // запуск API-метода /api/user/signup
        const apiUrl = URL_PREFIX + req.headers?.host + API_URL + 'signup'
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newUser)
        }
        fetch(apiUrl, params).then((apiRes) => {
            if (apiRes.ok) {
                apiRes.json().then((data) => {
                    res.status(201)
                    res.redirect('/')
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
        const id = req.user._id.toHexString()
        // получение данных
        const apiUrl = URL_PREFIX + req.headers?.host + API_URL + id
        fetch(apiUrl).then((apiRes) => {
            if (apiRes.ok) {
                apiRes.json().then((user) => {
                    res.status(200)
                    res.render('pages/users/profile', {
                        title: 'Информация о пользователе ' + user.login,
                        data: {},
                        user
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

