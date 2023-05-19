import express from 'express'
import fs from 'fs'
import logger from './middleware/logger.js'
import err404 from './middleware/err404.js'
import booksRouter from './routes/books.js'
import userRouter from './routes/user.js'
import CONFIG from './config.js'

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Создание объекта Express.JS
const app = express()
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

// Подключение moddleware
app.use(logger)

app.use(CONFIG.routes?.books || '/api/books', booksRouter)
app.use(CONFIG.routes?.users || '/api/user', userRouter)

app.use(err404)

/////////////////////////////////////////////////
/////////////////////////////////////////////////




/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
const PORT = process.env.PORT || CONFIG.port || 5000
app.listen(PORT)
console.log('Server started at port ' + PORT + '.')