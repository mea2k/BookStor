import express from 'express'
import counterRouter from './routes/counter.js'
import CONFIG from './config.js'

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Создание объекта Express.JS
const app = express()
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(CONFIG.routes?.counter || '/api/counter', counterRouter)

/////////////////////////////////////////////////
/////////////////////////////////////////////////




/////////////////////////////////////////////////
/////////////////////////////////////////////////

// запуск сервера на прослушивание
const PORT = process.env.PORT || CONFIG.port || 5010
app.listen(PORT)
console.log('Server started at port ' + PORT + '.')