import fs from 'fs'
import { Book } from './book.js'

class BookStorage {
    constructor(fileName = "public/bookstorage.json") {
        this.fileName = fileName
        try {
            this.storage = JSON.parse(fs.readFileSync(fileName, 'utf8')) || [];
        } catch (e) {
            this.storage = [];
        }
        //console.log({...this.storage})
    }

    dumpToFile() {
        let json = JSON.stringify(this.storage)
        fs.writeFileSync(this.fileName, json);
    }

    getAll() {
        return this.storage
    }

    get(id) {
        return this.storage.find((e) => e.id === id)
    }

    add(item) {
        // проверка, что item является классом Book
        // и книги с добавляемым ID в коллекции нет 
        if (item instanceof Book && this.get(item.id) === undefined) {
            this.storage.push(item)
            this.dumpToFile()
            return this.storage.length
        }
        return -1
    }

    modify(id, item) {
        const idx = this.storage.findIndex((e) => e.id === id)
        if (idx !== -1) {
            this.storage[idx] = {
                ...this.storage[idx],
                ...item,
                id: id
            }
            this.dumpToFile()
            return this.storage[idx]
        }
        return undefined
    }

    delete(id) {
        const idx = this.storage.findIndex((e) => e.id === id)
        if (idx !== -1) {
            this.storage.splice(idx, 1)
            this.dumpToFile()
            return 1
        }
        return 0
    }

}

// Создание глобального объекта "ХРАНИЛИЩЕ КНИГ"
const bookStorage = new BookStorage()

// экспорт не класса, а объекта
export { bookStorage }