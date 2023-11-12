import 'reflect-metadata';
import * as fs from 'fs';
import { ItemStorage } from '../interfaces/itemStorage';

// АБСТРАКТНЫЙ ШАБЛОННЫЙ КЛАСС ДЛЯ ХРАНЕНИЯ ОБЪЕКТОВ В JSON-ФАЙЛЕ
// Реализует интерфейс ItemStorage
// ШАБЛОННЫЕ ТИПЫ:
//		ItemType - тип хранимого объекта
//		ItemTypeDto - тип объекта после заполнения и проверки входных данных формы
//					  (часть полей из ItemType может не быть)
//					  (используется для CREATE и UPDATE)
//		KeyName - тип ключевого поля (которое является идентифицирующим для объекта)
//					  (один из аттрибутов ItemType)
abstract class StorageFile<
	ItemType,
	ItemTypeDto,
	KeyName extends keyof ItemType,
> implements ItemStorage<ItemType, ItemTypeDto, ItemType[KeyName]>
{
	// массив объектов типа ItemType
	protected _storage: Array<ItemType> = [];
	// имя файла, в котором хранится массив объектов
	protected _fileName: string;
	// имя ключевого поля
	protected _keyName: KeyName;
	// флаг вывода отладочной информации
	protected _debug: boolean;

	// TODO - дублирование кода (с storageDb) - как избавиться??
	// ТРЕБУЕТСЯ РЕАЛИЗАЦИЯ в наследниках
	protected abstract _getNextId(
		id: ItemType[KeyName] | null,
	): ItemType[KeyName];

	// Сохранение массива объектов (storage) в файл filename
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

	// Получение индекса объекта в массиве storage
	// по его идентификатору
	protected _getIndex(id: ItemType[KeyName]) {
		const idx = this._storage.findIndex(
			(e: ItemType) => e[this._keyName] == id,
		);
		return idx;
	}

	// Конструктор - параметры:
	// 		filename - имя файла для сохоранения массива объектов
	//		key - имя ключевого поля (его тип должен быть KeyName)
	//		debug - флаг вывода отладочной информации (true)
	constructor(fileName: string, key: KeyName, debug = true) {
		this._fileName = fileName;
		try {
			this._storage = JSON.parse(fs.readFileSync(fileName, 'utf8')) || [];
		} catch (e) {
			this._storage = [];
		}

		this._keyName = key;
		this._debug = debug;
	}

	//
	// РЕАЛИЗАЦИЯ МЕТОДОВ ИНТЕРФЕЙСА ITEMSTORAGE
	//

	async getAll(): Promise<ItemType[]> {
		return new Promise<ItemType[]>((resolve) => resolve(this._storage));
	}

	async get(id: ItemType[KeyName]): Promise<ItemType | null> {
		return new Promise<ItemType | null>((resolve) =>
			resolve(this._storage.find((e) => e[this._keyName] == id) || null),
		);
	}

	async create(item: ItemType | ItemTypeDto): Promise<ItemType | null> {
		let newId: ItemType[KeyName] = this._getNextId(
			(<ItemType>item)[this._keyName] || null,
		);

		if (this._debug) {
			console.log('CREATE -', item);
		}

		// меняем ID объекта, если такой уже есть
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

			// TODO: подумать как сделать, если внутри ItemType есть поля-массивы

			// копируем массив с авторами вручную
			// newItem['authors'] =
			// 	item['authors'] && item['authors'].length > 0
			// 		? item['authors']
			// 		: this._storage[idx]['authors'];

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
