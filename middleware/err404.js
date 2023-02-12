import { JSONError } from "../error.js"

const err404 = (req, res, next) => {
    const { url } = req
    res.status(404)
    const errStr =
        res.render('pages/error', {
            title: 'Ошибка 404',
            data: JSONError.err404(`Страница ${url} не найдена`)
        })

    // вызов следующего обработчика
    next()
}

// экспорт по умолчанию
export default err404