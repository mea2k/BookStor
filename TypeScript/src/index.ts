import express from 'express'
import mongoose from 'mongoose'

import booksAPIRouter from './routes/books'

import err404 from './middleware/err404'
import CONFIG from './config'
import { StorageTypes } from './interfaces/config'

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Создание объекта Express.JS
const app = express()
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

// обработчики URL-путей
app.use('/api/books', booksAPIRouter)

// обрабока всех остальных путей = ошибка 404
app.use(err404)

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/"
const MONGO_DBNAME = process.env.MONGO_DBNAME || "bookstore"
const MONGO_INITDB_USERNAME = process.env.MONGO_INITDB_USERNAME || "user"
const MONGO_INITDB_PASSWORD = process.env.MONGO_INITDB_PASSWORD || "user"

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
function serverStart(dbUrl = "", port = CONFIG.PORT) {
    switch (CONFIG.STORAGE_TYPE) {
        case StorageTypes.mongo:
            const connString = dbUrl || CONFIG.MONGO_URL + CONFIG.MONGO_DATABASE + '?authSource=admin'
            // ПОДКЛЮЧЕНИЕ К БД
            try {
                console.log('Connecting to', connString, CONFIG.MONGO_USERNAME, CONFIG.MONGO_PASSWORD)
                mongoose.connect(connString, {
                    "auth": {
                        "username": CONFIG.MONGO_USERNAME,
                        "password": CONFIG.MONGO_PASSWORD,
                        //"useNewUrlParser": true
                    }
                }).then(() => runApp(port))

                // Connected handler
                mongoose.connection.on('connected', (err) => {
                    if (err == null)
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
        case StorageTypes.file:
            // ИСПОЛЬЗУЕМ ФАЙЛЫ
            runApp(port)
            break
    }
}

function runApp(port: number) {
    app.listen(port, () => {
    //server.listen(port, () => {
        console.log('Server started at port ' + port + '.')
    })
}


/////////////////////////////////////////////////
/////////////////////////////////////////////////


serverStart();





