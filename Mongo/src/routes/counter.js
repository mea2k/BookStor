import books from "../models/books.js"

// СТАТИЧЕСКИЙ КЛАСС ДЛЯ ГЕНЕРАЦИИ ID объектов
class globalCounter {
    static _id = 1

    static async next() {
        var res = 1
        try {
            res = await books.find({}, { _id: 1 }).sort({ _id: -1 }).limit(1)
        } catch (e) {
        }
        this._id = +(res[0]?._id ? res[0]._id : 1) + 1
        return (this._id).toString()
    }
}


export default globalCounter