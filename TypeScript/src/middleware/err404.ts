import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JSONError } from '../interfaces/error';


const err404 = (req: Request, res: Response, next: NextFunction): void /*RequestHandler*/ => {
    const { url } = req
    // отправка кода ошибки и текста сообщения
    res.status(404).json(JSONError.err404(`Страница ${url} не найдена`))

    // вызов следующего обработчика
    next()
}



// экспорт по умолчанию
export default err404