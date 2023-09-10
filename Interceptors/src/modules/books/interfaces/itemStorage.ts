/** ИНТЕРФЕЙС - УНИВЕРСАЛЬНЫЙ КОНТЕЙНЕР ОБЪЕКТОВ
 * ШАБЛОННЫЕ ТИПЫ:
 *   ItemType - тип объекта
 *   ItemDtoType - тип элемента для добавления/обновления объекта
 *   KeyType - тип ключевого параметра объекта
 * МЕТОДЫ:
 *   getAll()     - получение всего содержимого контейнера
 *                  (массив объектов типа ItemType)
 *   get(id)      - получение одного объекта  по идентификатору ID
 *                  (объект типа ItemType)
 *   create(item) - добавление объекта в хранилище (item типа ItemDtoType)
 *               ID объекта должно формироваться автоматически в реализации интерфейса
 *   update(id, item) - изменение содержимого полей объекта с идентификатором ID.
 *   delete(id) - удаление объекта с идентификатором ID.
 *                Возвращает TRUE в случае успеха или FALSE, если объект не найден (через Promise).
 *
 */
export interface ItemStorage<ItemType, ItemTdoType, KeyType> {
	// getBooks()  - возвращает все содержимое контейнера
	getAll(): Promise<ItemType[]>;

	// getBook(id) - возвращает один объект (книгу) по идентификатору ID
	//               или null, если не найден
	get(id: KeyType): Promise<ItemType | null>;

	// createBook(item: Book) - добавление объекта(книги) в хранилище
	//                          возвращает добавленный объект или null. ID объекта формируется автоматически
	create(item: ItemType | ItemTdoType): Promise<ItemType | null>;

	// updateBook(id, item: Book) - изменение содержимого полей объекта(книги) с идентификатором ID.
	//                              Возвращает измененный объект или null, если объекта с ID нет
	update(id: KeyType, item: ItemType | ItemTdoType): Promise<ItemType | null>;

	// deleteBook(id) - удаление объекта(книгу) с идентификатором ID.
	//                  Возвращает TRUE в случае успеха или FALSE, если объект не найден.
	delete(id: KeyType): Promise<boolean>;
}
