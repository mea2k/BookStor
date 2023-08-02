import 'reflect-metadata';
import { Model, SortOrder } from 'mongoose';
import { ItemStorage } from '../../interfaces/itemStorage';

abstract class StorageDb<ItemType, ItemTypeDto, KeyName extends keyof ItemType>
	implements ItemStorage<ItemType, ItemTypeDto, ItemType[KeyName]>
{
	protected _model: Model<ItemType>;
	protected _keyName: KeyName;

	protected abstract _getNextId(
		id: ItemType[KeyName] | null,
	): ItemType[KeyName];

	constructor(model: Model<ItemType>, key: KeyName) {
		this._model = model;
		this._keyName = key;
	}

	getAll(): Promise<ItemType[]> {
		return this._model.find().exec();
	}

	get(id: ItemType[KeyName]): Promise<ItemType | null> {
		return this._model.findById(id).exec();
	}

	async create(
		item: ItemType | ItemTypeDto,
	): Promise<ItemType & Document & any> {
		const maxId: Array<ItemType> = await this._model
			.find({}, { [this._keyName]: 1 })
			.sort({ [this._keyName]: <SortOrder>-1 })
			.limit(1);
		// новый ID
		const nextId = this._getNextId(
			maxId.length ? <ItemType[KeyName]>maxId[0][this._keyName] : null,
		);

		console.log('CREATE -', item);

		const newItem = new this._model({ ...item, [this._keyName]: nextId });
		return newItem.save();
	}

	// TODO: разобраться с ANY - Mongoose не принимает без any
	async update(
		id: ItemType[KeyName],
		item: ItemType | ItemTypeDto,
	): Promise<ItemType | null> {
		return this._model
			.findByIdAndUpdate(id, { $set: <any>{ ...item } }, { new: true })
			.exec();
	}

	async delete(id: ItemType[KeyName]): Promise<boolean> {
		const res = await this._model.findByIdAndDelete(id).exec();
		if (res) return true;
		return false;
	}
}

// экспорт класса
export { StorageDb };
