import "reflect-metadata";
import { injectable, inject } from "inversify";
import { IBook, IBookDto } from "../../interfaces/book";
import { StorageDb } from "../storageDb";
import { BookModel } from "./bookModel";

@injectable()
class BookStorageDb extends StorageDb<IBook, IBookDto, "_id"> {
    constructor() {
        super(BookModel, "_id")
    }

    _getNextId(id: IBook["_id"]) {
        if (id)
            return id + 1
        return 1
    }

}

// экспорт класса
export { BookStorageDb }