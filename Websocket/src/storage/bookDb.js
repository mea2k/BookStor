
/////////////////////////////////////////////////
/////////////////////////////////////////////////

/** КЛАСС - КОНТЕЙНЕР КНИГ НА ОСНОВЕ БД
 * сохраняет всю информацию о книгах в коллекции БД DBNAME
 * (конструктору передается модель-объект для работы с БД)
 * МЕТОДЫ КЛАССА:
 *   getAll()  - возвращает все содержимое контейнера
 *   get(id)   - возвращает один объект (книгу) по идентификатору ID 
 *               или undefined, если не найден 
 *   add(item) - добавление объекта(книги) в хранилище
 *               возвращает добавленный объект. ID объекта формируется автоматически
 *   modify(id, item) - изменение содержимого полей объекта(книги) с идентификатором ID.
 *                      Возвращает измененный объект или undefined, если объекта с ID нет
 *   delete(id) - удаление объекта(книгу) с идентификатором ID.
 *                Возвращает 1 в случае успеха или 0, если объект не найден.
  * 
*/
class BookDb {
    constructor(dbModel) {
        this.dbModel = dbModel
    }

    async getAll() {
        let data = []
        try {
            data = await this.dbModel.find().select('-__v')
        } catch (e) {
            console.log("ERROR - ", e)
        }
        return data
    }

    async get(id) {
        let data = undefined
        try {
            data = await this.dbModel.findById(id).select('-__v')
        } catch (e) {
            console.log("ERROR - ", e)
        }
        return data
    }

    async add(item) {
        // формируем новый уникальный ID
        // и пытаемся добавить новый объект(книгу) в цикле,
        // пока не добавится
        while (1) {
            var cursor = this.dbModel.find({}, { _id: 1 }).sort({ _id: -1 }).limit(1);
            var nextId = cursor.hasNext() ? +(cursor.next()._id) + 1 : 1;
            item._id = nextId;
            var results = await this.dbModel.collection.insert(item);
            if (results.hasWriteError()) {
                if (results.writeError.code == 11000 /* dup key */)
                    continue;
                else
                    console.log("ERROR - ", tojson(results))
                return undefined
            }
            break;
        }
        return results
    }

    async modify(id, item) {
        let data = undefined
        try {
            const res = await this.dbModel.findByIdAndUpdate(id, item)
            // получение обновленных данных
            data = this.get(id)
            //data = await this.dbModel.findById(id).select('-__v')
        } catch (e) {
            console.log("ERROR - ", e)
        }
        return data
    }

    async delete(id) {
        try {
            // удаление существующей книги
            const data = await this.dbModel.findByIdAndDelete(id)
            if (data)
                return 1

        } catch (e) {
            console.log("ERROR - ", e)
        }
        return 0
    }
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// экспорт класса
export { BookDb }