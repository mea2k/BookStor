import express from 'express';
import logger from './middleware/logger.js';
import err404 from './middleware/err404.js'
import booksRouter from './routes/books.js'
import userRouter from './routes/user.js'


/////////////////////////////////////////////////
/////////////////////////////////////////////////


// Создание объекта Express.JS
const app = express()
app.use(express.json())

// Подключение moddleware
app.use(logger)

// Подключение обработчиков URL
app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)

app.use(err404)


/////////////////////////////////////////////////
/////////////////////////////////////////////////




/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log('Server started at port ' + PORT + '.')