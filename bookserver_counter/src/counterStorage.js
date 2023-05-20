import fs from 'fs'
import { Counter } from './counter.js'
import CONFIG from './config.js';

const defaultFilename = (process.env.DATA_PATH || CONFIG.data_path || "data/") + "bookcounter.json"

class CounterStorage {
    constructor(fileName = defaultFilename) {
        this.fileName = fileName
        this.storage = [];
        try {
            const data = JSON.parse(fs.readFileSync(fileName, 'utf8')) || [];
            for (const element of data) {

                this.storage.push(new Counter({ ...element }));
            }
        } catch (e) {
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

    get(bookId) {
        return this.storage.find((e) => e.bookId === bookId)
    }
    findIndex(bookId) {
        return this.storage.findIndex((e) => e.bookId === bookId)
    }

    inc(bookId) {
        // проверка, что у этой книги еще нет счетчика 
        const idx = this.findIndex(bookId)
        if (idx === -1) {
            const newCounter = new Counter({ bookId })
            this.storage.push(newCounter)
            this.dumpToFile()
            return newCounter
        } else {
            this.storage[idx].inc()
            this.dumpToFile()
            return this.storage[idx]
        }
    }

    delete(bookId) {
        const idx = this.findIndex(bookId)
        if (idx !== -1) {
            this.storage.splice(idx, 1)
            this.dumpToFile()
            return 1
        }
        return 0
    }

}

// Создание глобального объекта "ХРАНИЛИЩЕ КНИГ"
const counterStorage = new CounterStorage()

// экспорт не класса, а объекта
export { counterStorage }