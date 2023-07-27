import { v4 as uuid } from 'uuid'

// СТАТИЧЕСКИЙ КЛАСС ДЛЯ ГЕНЕРАЦИИ ID объектов
class globalIDCounter {
    static _id = 1

    static get() {
        return (this._id++).toString()
    }
}

class Book {
    constructor(
        title = "",
        description = "",
        authors = "",
        favorite = "",
        fileCover = "",
        fileName = "",
        fileBook = "",
        id = globalIDCounter.get()
    ) {
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
        this.id = id
    }
}


export {Book}