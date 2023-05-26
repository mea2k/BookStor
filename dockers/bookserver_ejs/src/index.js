import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import booksEJSRouter from './routes/books/index.js'
import indexEJSRouter from './routes/index.js'
import CONFIG from './config.js'

/////////////////////////////////////////////////
/////////////////////////////////////////////////


// Создание объекта Express.JS
const app = express()
app.use(express.json())

app.use(express.urlencoded({extended: true}));

// используем шаблонизатор EJS
app.set('view engine', 'ejs');

// настройка папки views
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const views_path = path.join(__dirname, 'views')
app.set('views', views_path)



// Подключение обработчиков URL
app.use('/books', booksEJSRouter)
app.use('/', indexEJSRouter)

/////////////////////////////////////////////////
/////////////////////////////////////////////////




/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
const PORT = process.env.PORT || CONFIG.port || 3000
app.listen(PORT)
console.log('Server started at port ' + PORT + '.')