import express from 'express'
import err404 from './middleware/err404.js'
import booksAPIRouter from './routes/books.js'
import mongoose from 'mongoose'

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



// запуск сервера на прослушивание
async function serverStart(dbUrl = MONGO_URL, dbName = MONGO_DBNAME, port = PORT) {
    try {
        console.log(dbUrl + dbName)
        await mongoose.connect(dbUrl + dbName, {
            "auth": {
                "username": MONGO_INITDB_USERNAME,
                "password": MONGO_INITDB_PASSWORD
            }
        });
        app.listen(PORT, () => {
            console.log('Server started at port ' + port + '.')
        })
    } catch (e) {
        console.log('Error connection to database!')
        console.log(e)
    }
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

serverStart();
