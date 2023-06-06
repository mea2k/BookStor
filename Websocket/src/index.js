import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Server } from 'socket.io'
import { createServer } from 'http';
import LocalStrategy from 'passport-local'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import usersRouter from './routes/user.js'
import indexRouter from './routes/index.js'
import { err404 } from './error.js'
import { userStorage } from './users/userStorage.js'
import verify from './auth/verify.js'
import CONFIG from './config.js'
import booksRouter from './routes/books.js'
import chatRouter from './routes/chat.js'

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Создание объекта Express.JS
const app = express()
// Создание объекта для исползьзования Socket.IO
const server = createServer(app);
const io = new Server(server);1

// настройка параметров ExpressJS
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Описание авторизации
const options = {
    usernameField: 'login',
    passwordField: 'password'
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await userStorage.get(id)
        if (user)
            return cb(null, user)
        return cb(null, null)
    } catch (err) {
        return cb(err)
    }
});

// подключаем модли авторизации
app.use(session({
    secret: 'SECRET',
    //secret: cookie_secret,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// используем шаблонизатор EJS
app.set('view engine', 'ejs');
// настройка папки views
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const views_path = path.join(__dirname, 'views')
app.set('views', views_path)

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// обработчики URL-путей
app.use('/user', usersRouter)
app.use('/books', booksRouter)
app.use('/chat', chatRouter)
app.use('/', indexRouter)

// обрабока всех остальных путей - ошибка 404
app.use(err404)

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Подключаем Socket.IO
io.on('connection', (socket) => {
    const {id} = socket;
    console.log(`Socket connected: ${id}`);

    // сообщение себе
    socket.on('message-to-me', (msg) => {
        msg.type = 'me';
        socket.emit('message-to-me', msg);
        //console.log('MSG-TO-ME: ',msg)
    });

    // сообщение для всех
    socket.on('message-to-all', (msg) => {
        msg.type = 'all';
        socket.broadcast.emit('message-to-all', msg);
        socket.emit('message-to-all', msg);
        //console.log('MSG-TO-ALL: ',msg)
    });

    // работа с комнатами
    const {roomName} = socket.handshake.query;
    console.log(`Socket roomName: ${roomName}`);
    socket.join(roomName);
    socket.on('message-to-room', (msg) => {
        msg.type = `room: ${roomName}`;
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
function serverStart(dbUrl = "", port = CONFIG.PORT) {
    switch (CONFIG.STORAGE_TYPE) {
        case "mongo":
            // ПОДКЛЮЧЕНИЕ К БД
            try {
                const connString = dbUrl || CONFIG.MONGO_URL + CONFIG.MONGO_DATABASE + '?authSource=admin'
                mongoose.connect(connString, {
                    "auth": {
                        "username": CONFIG.MONGO_USERNAME,
                        "password": CONFIG.MONGO_PASSWORD,
                        "useNewUrlParser": true
                    }
                }).then(runApp(port))

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
            break
        case "file":
            // ИСПОЛЬЗУЕМ ФАЙЛЫ
            runApp(port)
            break
    }
}

function runApp(port) {
    //app.listen(port, () => {
    server.listen(port, () => {
        console.log('Server started at port ' + port + '.')
    })
}


/////////////////////////////////////////////////
/////////////////////////////////////////////////


serverStart();
