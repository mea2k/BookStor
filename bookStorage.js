import { Book } from './book.js'

class BookStorage {
    constructor() {
        this.storage = []
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
            return this.storage[idx]
        }
        return undefined
    }

    delete(id) {
        const idx = this.storage.findIndex((e) => e.id === id)
        if (idx !== -1) {
            this.storage.splice(idx, 1)
            return 1
        }
        return 0
    }

}


export {BookStorage}