import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Model, SortOrder } from 'mongoose';
import { ItemStorage } from "../interfaces/itemStorage";


@injectable()
abstract class StorageDb<ItemType, ItemTypeDto, KeyName extends keyof ItemType> implements ItemStorage<ItemType, ItemTypeDto, ItemType[KeyName]>  {
    protected _model: Model<ItemType & Document>
    protected _keyName: KeyName

    protected abstract _getNextId(id: ItemType[KeyName] | null): ItemType[KeyName]

    // TODO: без ANY почему-то не работает
    constructor(modelName: Model<ItemType & Document & any>, key: KeyName) {
        this._model = modelName
        this._keyName = key
    }

    getAll(): Promise<ItemType[]> {
        console.log(this._model)
        return this._model.find().exec()
    }

    get(id: ItemType[KeyName]): Promise<ItemType | null> {
        return this._model.findById(id).exec()
    }

    async create(item: ItemType | ItemTypeDto): Promise<ItemType | null> {
        const maxId: Array<ItemType> = await this._model.find({}, { [this._keyName]: 1 }).sort({ [this._keyName]: <SortOrder>(-1) }).limit(1)
        // новый ID
        const nextId = this._getNextId(maxId ? <ItemType[KeyName]>(maxId[0][this._keyName]) : null);

        const newItem = new this._model({ ...item, [this._keyName]: nextId })
        return newItem.save()
    }

    // TODO: разобраться с ANY - Mongoose не принимает без any
    update(id: ItemType[KeyName], item: ItemType | ItemTypeDto): Promise<ItemType | null> {
        return this._model.findByIdAndUpdate(id, { $set: <any>({ ...item }) }, { new: true }).exec()
    }

    // TODO: разобраться с ANY - должно возвращать Promise<boolean>
    delete(id: ItemType[KeyName]): Promise<any> {
        return (this._model.findByIdAndDelete(id).exec())
    }

}


// экспорт класса
export { StorageDb }