import fs from 'fs'
import os from 'os'

const logger = (req, res, next) => {
    const { url, method } = req
    const date = new Date()


    const dateStr = date.toLocaleString('ru-RU').replace(',', '')

    const data = `${dateStr} - ${method.slice(0,4)}\t${url}`
    fs.appendFile(
        'server.log',
        data + os.EOL,
        (err) => {
            if (err) {
                console.log('LOGGER: ошибка записи журнала.')

                throw new Error(err)
            }
        })
    // вызов следующего обработчика
    next()
}

// экспорт по умолчанию
export default logger