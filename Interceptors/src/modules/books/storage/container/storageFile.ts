import 'reflect-metadata';
import * as fs from 'fs';
import { ItemStorage } from '../../interfaces/itemStorage';

abstract class StorageFile<
	ItemType,
	ItemTypeDto,
	KeyName extends keyof ItemType,
> implements ItemStorage<ItemType, ItemTypeDto, ItemType[KeyName]>
{
	protected _storage: Array<ItemType> = [];
	protected _fileName: string;
	protected _keyName: KeyName;

	// TODO - дублирование кода (с storageDb) - как избавиться??
	protected abstract _getNextId(
		id: ItemType[KeyName] | null,
	): ItemType[KeyName];

	protected _dumpToFile() {
		// если файл настроен - сохраняем в него содержимое контейнера
		if (this._fileName) {
			const json = JSON.stringify(this._storage);
			try {
				fs.writeFileSync(this._fileName, json);
			} catch (e) {
				console.log('Error write to file ', this._fileName);
				console.log(e);
			}
		}
	}

	protected _getIndex(id: ItemType[KeyName]) {
		const idx = this._storage.findIndex(
			(e: ItemType) => e[this._keyName] == id,
		);
		return idx;
	}

	constructor(fileName: string, key: KeyName) {
		this._fileName = fileName;
		try {
			this._storage = JSON.parse(fs.readFileSync(fileName, 'utf8')) || [];
		} catch (e) {
			this._storage = [];
		}

		this._keyName = key;
	}

	async getAll() {
		return new Promise<ItemType[]>((resolve) => resolve(this._storage));
	}

	async get(id: ItemType[KeyName]) {
		return new Promise<ItemType | null>((resolve) =>
			resolve(this._storage.find((e) => e[this._keyName] == id) || null),
		);
	}

	async create(item: ItemType | ItemTypeDto) {
		let newId: ItemType[KeyName] = this._getNextId(
			(<ItemType>item)[this._keyName] || null,
		);

		console.log('CREATE -', item);
		// меняем ID книги, если такая в коллекции уже есть
		while (await this.get(newId)) {
			newId = this._getNextId(newId);
		}
		// создаем новый объект типа ItemType
		const newItem: ItemType = <ItemType>{ ...item };
		newItem[this._keyName] = newId;
		// сохраняем новый объект в хранилище и в файл
		this._storage.push(<ItemType>newItem);
		this._dumpToFile();
		return this.get(newId);
	}

	async update(
		id: ItemType[KeyName],
		item: ItemType | ItemTypeDto,
	): Promise<ItemType | null> {
		const idx = this._getIndex(id);
		if (idx !== -1) {
			// создаем новый объект типа ItemType
			const newItem: ItemType = <ItemType>{
				...this._storage[idx],
				...item,
			};
			newItem[this._keyName] = id;

			// копируем массив с авторами вручную
			newItem['authors'] =
				item['authors'] && item['authors'].length > 0
					? item['authors']
					: this._storage[idx]['authors'];

			// сохраняем новый объект в хранилище и в файл
			this._storage[idx] = newItem;
			this._dumpToFile();
			return new Promise((resolve) => resolve(this._storage[idx]));
		}
		return new Promise((resolve) => resolve(null));
	}

	async delete(id: ItemType[KeyName]): Promise<boolean> {
		const idx = this._getIndex(id);
		if (idx !== -1) {
			this._storage.splice(idx, 1);
			this._dumpToFile();
			return new Promise((resolve) => resolve(true));
		}
		return new Promise((resolve) => resolve(false));
	}
}

// экспорт класса
export { StorageFile };
