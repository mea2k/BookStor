import "reflect-metadata";
import { injectable, inject } from "inversify";
import fs from 'fs'
import { ItemStorage } from "../interfaces/itemStorage";


@injectable()
abstract class StorageFile<ItemType, ItemTypeDto, KeyName extends keyof ItemType> implements ItemStorage<ItemType, ItemTypeDto, ItemType[KeyName]> {
    protected _storage: Array<ItemType> = []
    protected _fileName: string

    // TODO - дублирование кода (с storageDb) - как избавиться??
    protected abstract _getNextId(id: ItemType[KeyName] | null): ItemType[KeyName]
    protected _keyName: KeyName

    protected _dumpToFile() {
        // если файл настроен - сохраняем в него содержимое контейнера
        if (this._fileName) {
            const json = JSON.stringify(this._storage)
            try {
                fs.writeFileSync(this._fileName, json)
            } catch (e) {
                console.log("Error write to file ", this._fileName)
                console.log(e)
            }
        }
    }

    protected _getIndex(id: ItemType[KeyName]) {
        const idx = this._storage.findIndex((e: ItemType) => e[this._keyName] == id)
        return idx
    }

    constructor(fileName: string = "", key: KeyName) {
        this._fileName = fileName
        try {
            this._storage = JSON.parse(fs.readFileSync(fileName, 'utf8')) || [];
        } catch (e) {
            this._storage = [];
        }
        //console.log({...this.storage})
        this._keyName = key
    }

    getAll() {
        return new Promise<ItemType[]>((resolve) => resolve(this._storage));
    }

    get(id: ItemType[KeyName]) {
        return new Promise<ItemType | null>((resolve) => resolve(this._storage.find((e) => e[this._keyName] == id) || null));
    }

    async create(item: ItemType | ItemTypeDto) {
        let newId: ItemType[KeyName] = this._getNextId((<ItemType>item)[this._keyName] || null)

        // меняем ID книги, если такая в коллекции уже есть
        while (await this.get(newId)) {
            newId = this._getNextId(newId)
        }
        this._storage.push(<ItemType>{ ...item, _id: newId })
        this._dumpToFile()
        return this.get(newId)
    }

    update(id: ItemType[KeyName], item: ItemType | ItemTypeDto): Promise<ItemType | null> {
        const idx = this._getIndex(id) 
        if (idx !== -1) {
            this._storage[idx] = {
                ...this._storage[idx],
                ...item,
                KeyId: id
            }
            this._dumpToFile()
            return new Promise((resolve) => resolve(this._storage[idx]))
        }
        return new Promise((resolve) => resolve(null))
    }

    delete(id: ItemType[KeyName]): Promise<boolean> {
        const idx = this._getIndex(id)
        if (idx !== -1) {
            this._storage.splice(idx, 1)
            this._dumpToFile()
            return new Promise((resolve) => resolve(true))
        }
        return new Promise((resolve) => resolve(false))
    }

}


// экспорт класса
export { StorageFile }