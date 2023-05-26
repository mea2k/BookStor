import { JSONError } from "../error.js"

const err404 = (req, res, next) => {
    const { url } = req
    res.status(404)
    const errStr = 
    res.json(JSONError.err404(`Страница ${url} не найдена`))

    // вызов следующего обработчика
    next()
}

// экспорт по умолчанию
export default err404