import express from 'express'
import logger from './middleware/logger.js'
import err404 from './middleware/err404.js'
import booksRouter from './routes/api/books.js'
import booksEJSRouter from './routes/books/index.js'
import userRouter from './routes/api/user.js'
import indexEJSRouter from './routes/index.js'

/////////////////////////////////////////////////
/////////////////////////////////////////////////


// Создание объекта Express.JS
const app = express()
app.use(express.json())

app.use(express.urlencoded({extended: true}));

// используем шаблонизатор EJS
app.set('view engine', 'ejs');

// Подключение moddleware
app.use(logger)

// Подключение обработчиков URL
app.use('/books', booksEJSRouter)
app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)
app.use('/', indexEJSRouter)

app.use(err404)

/////////////////////////////////////////////////
/////////////////////////////////////////////////




/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log('Server started at port ' + PORT + '.')