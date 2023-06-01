import express from 'express'
import session from 'express-session'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import usersRouter from './routes/user.js'
import indexRouter from './routes/index.js'
import userApiRouter from './routes/api/user.js'
import { err404 } from './error.js'
import users from './models/user.js'
import { sha256Sync } from './hash.js'

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Описание авторизации
const options = {
    usernameField: 'login',
    passwordField: 'password'
}

const verify = (login, password, cb) => {
    users.findOne({ login }).then(async (user) => {
        // не найден пользователь
        if (!user)
            return cb(null, false, { message: "Неверное имя пользователя" })
        // пароли не совпадаюь
        const passw = await sha256Sync(password, user.salt)
        if (passw !== user.password)
            return cb(null, false, { message: "Неверный пароль" })
        // все ОК
        else
            return cb(null, user)
    })
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await users.findById(id)
        if (user)
            return cb(null, user)
        return cb(null, null)
    } catch (err) {
        return cb(err)
    }
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Создание объекта Express.JS
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// используем шаблонизатор EJS
app.set('view engine', 'ejs');
// настройка папки views
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const views_path = path.join(__dirname, 'views')
app.set('views', views_path)


// подключаем модли авторизации
app.use(session({
    secret: 'SECRET',
    //secret: cookie_secret,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

// обработчики URL-путей
app.use('/user', usersRouter)
app.use('/api/user', userApiRouter)
app.use('/', indexRouter)

// обрабока всех остальных путей - ошибка 404
app.use(err404)

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Константы для подключения к БД Mongo
// и создания неоьходимой БД и коллекции
const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/"
const MONGO_DBNAME = process.env.MONGO_DBNAME || "bookstore"
const MONGO_INITDB_USERNAME = process.env.MONGO_INITDB_USERNAME || "user"
const MONGO_INITDB_PASSWORD = process.env.MONGO_INITDB_PASSWORD || "user"
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
function serverStart(dbUrl = MONGO_URL, dbName = MONGO_DBNAME, port = PORT) {
    const connString = dbUrl + dbName + '?authSource=admin'
    try {
        mongoose.connect(connString, {
            "auth": {
                "username": MONGO_INITDB_USERNAME,
                "password": MONGO_INITDB_PASSWORD,
                "useNewUrlParser": true
            }
        }).then(() => {
            app.listen(PORT, () => {
                console.log('Server started at port ' + port + '.')
            })
        })

        // Connected handler
        mongoose.connection.on('connected', (err) => {
            console.log("Connected to DB: " + connString);
        });

        // Error handler
        mongoose.connection.on('error', (err) => {
            console.log(err);
        });

    } catch (e) {
        console.log('Error connection to database: ' + connString + '!')
        console.log(e)
    }
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

serverStart();

// app.listen(PORT)
// console.log('Server started at port ' + PORT + '.')
