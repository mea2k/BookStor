import fs from 'fs'

/////////////////////////////////////////////////
/////////////////////////////////////////////////

/** КЛАСС - КОНТЕЙНЕР КНИГ НА ОСНОВЕ ФАЙЛА
 * сохраняет всю информацию о книгах в файле FILENAME
 * (имя передается конструктору, если имени нет - то просто в памяти)
 * МЕТОДЫ КЛАССА:
 *   getAll()  - возвращает все содержимое контейнера
 *   get(id)   - возвращает один объект (книгу) по идентификатору ID 
 *               или undefined, если не найден 
 *   add(item) - добавление объекта(книги) в хранилище
 *               возвращает добавленный объект или undefined. ID объекта формируется автоматически
 *   modify(id, item) - изменение содержимого полей объекта(книги) с идентификатором ID.
 *                      Возвращает измененный объект или undefined, если объекта с ID нет
 *   delete(id) - удаление объекта(книгу) с идентификатором ID.
 *                Возвращает 1 в случае успеха или 0, если объект не найден.
 *   _dumpToFile() - сохранение содержимого контейнера в файле FILENAME
 * 
*/
class BookFile {
    constructor(filename = undefined) {
        this.fileName = filename
        // считываем содержимое файла и заполняем контейнер
        if (this.fileName) {
            try {
                this.storage = JSON.parse(fs.readFileSync(filename, 'utf8')) || [];
            } catch (e) {
                this.storage = [];
            }
        }
    }

    _dumpToFile() {
        // если файл настроен - сохраняем в него содержимое контейнера
        if (this.fileName) {
            let json = JSON.stringify(this.storage)
            try {
                fs.writeFileSync(this.fileName, json)
            } catch (e) {
                console.log("Error write to file ", this.fileName)
                console.log(e)
            }
        }
    }

    getAll() {
        return this.storage.find();
    }

    get(id) {
        return this.storage.find((e) => e.id == id)
    }

    add(item) {
        const oldSize = this.storage.length
        item.id = +this.storage.length + 1
        // меняем ID книги, если такая в коллекции уже есть
        while (this.get(item.id)) {
            item.id++
        }
        this.storage.push(item)
        this.dumpToFile()
        if (this.storage.length > oldSize)
            return item
        else
            return undefined
    }

    modify(id, item) {
        const idx = this.storage.findIndex((e) => e.id == id)
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
        const idx = this.storage.findIndex((e) => e.id == id)
        if (idx !== -1) {
            this.storage.splice(idx, 1)
            this.dumpToFile()
            return 1
        }
        return 0
    }
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// экспорт класса
export { BookFile }