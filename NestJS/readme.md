# BookStor с использованием NestJS

Backend-сервер "BookStor", написанный на языке программирования TypeScript с использованием платформы NestJS, с возможностью использовать в качестве хранилища JSON-файлы ~~или БД Mongo~~ *(будет реализовано позднее)*.

Код соответствует ВСЕМ (_почти_) требованиям **SOLID**.

Основные возможности сервера:
1. Получение всех книг (`GET /api/books`).
2. Получение книги по ID (`GET /api/books/{id}`)
3. Создание книги (`POST /api/books`).
4. Обновление книги с идентификатором ID (`PUT /api/books/{id}`).
5. Удаление книги с идентификатором ID (`DELETE /api/books/{id}`)


## Модули

В приложении реализованы следующие модули:
1. `CONFIG` ([src/config/config.module.ts](src/config/config.module.ts)) - настройки функционирования приложения.
2. `BOOKS`  ([src/books/books.module.ts](src/books/books.module.ts)) - работа с книгами и их хранилищем.
3. `APP`  ([src/app.module.ts](src/app.module.ts)) - само приложение.


### Модуль "CONFIG"

Модуль `CONFIG` содержит все настройки функционирования приложения и других модулей (например, модуля `BOOKS`).

Все возможные параметры описаны в интерфейсе `IConfig` ([src/config/interfaces/config.ts](src/config/interfaces/config.ts)).

**Провайдер модуля** - `ConfigService` ([src/config/config.service.ts](src/config/config.service.ts)):
- заполняет все значения параметров из значений по умолчанию, переменных окружения
- позволяет получить значение параметра по ключу (метод [get()](src/config/config.service.ts#L51))

**Контроллер модуля** - `ConfigController` ([src/config/config.controller.ts](src/config/config.controller.ts)):
- реализует обработку URL-путей `/config/{key}` с вызовом метода `get(key)` у класса `ConfigService`

Модуль `CONFIG` ([src/config/config.module.ts](src/config/config.module.ts)) экспортирует класс `ConfigService`, который является инжектируемым (`@Injected()`) в провайдеры других модулей.



### Модуль "BOOKS"

Модуль `BOOKS` содержит весь функционал по работе с книгами. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService` ([src/books/books.module.ts](src/books/books.module.ts)).


#### Провайдеры модуля

1. `BooksService` - ([src/books/books.service.ts](src/books/books.service.ts)):
- создает хранилище на основании параметров модуля CONFIG (параметр `STORAGE_TYPE` - {`file|mongo`})
- вызывает методы хранилища (`getAll`, `get(id)`, `create(item)`, `update(id,item)`, `delete(id)`)
2. `BookStorageFile` - хранилище на основе JSON-файла - инжектируется в качестве хранилища в BookService
3. `BookStorageDb` - хранилище на основе БД Mongo - инжектируется в качестве хранилища в BookService - *не реализовано*

#### Контроллер модуля

Контроллер модуля - `BooksController` ([src/books/books.controller.ts](src/books/books.controller.ts)):
- реализует обработку URL-путей `/api/books/` с вызовом различных методов  у класса `booksService`



#### Интерфейс IBOOK

Интерфейс книги `IBook` реализован в файле [src/books/interfaces/book.ts](src/books/interfaces/book.ts). Для реализации добавления/ихменения информации о книге реализован интерфейс `IBookDto` в файле [src/books/interfaces/book.ts](src/books/interfaces/book.ts#L23).


#### Параметризированный/шаблонный интерфейс "ХРАНИЛИЩЕ" (generic)

Для реализации контейнеров подготовлен интерфейс с параметрическими типами данных `ItemStorage<ItemType, ItemTdoType, KeyType>` ([src/books/interfaces/itemStorage.ts](src/books/interfaces/itemStorage.ts)).

Параметрические типы данных:
- `ItemType` - тип хранимого объекта
- `ItemDtoType` - тип элемента для добавления/обновления объекта
- `KeyType` - тип ключевого параметра объекта

Обязательные для реализации методы интерфейса:
- `getAll()` - получение всего содержимого контейнера (массив объектов типа `ItemType`)
- `get(id)`  - получение одного объекта типа `ItemType` по идентификатору ID (тип идентификатора - `KeyType`)
- `create(item)` - добавление объекта в хранилище. Объект описывается типом `ItemDtoType`. ID объекта должно формироваться автоматически в реализации интерфейса
- `update(id, item)` - изменение содержимого полей объекта с идентификатором ID (ID типа `KeyType`, item типа `ItemDtoType`)
- `delete(id)` - удаление объекта с идентификатором ID (ID типа `KeyType`). Возвращает `TRUE` в случае успеха или `FALSE`, если объект не найден (через Promise).

**Результаты всех методов возвращают Promise!**

#### Абстрактный класс "ХРАНИЛИЩЕ НА ОСНОВЕ ФАЙЛА"

На базе интерфейса `ItemStorage` реализован абстрактный параметризированный класс `StorageFile<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/books/storage/container/storageFile.ts](src/books/storage/container/storageFile.ts).

Параметрические типы данных:
- `ItemType` - тип хранимого объекта
- `ItemTypeDto` - тип элемента для добавления/обновления объекта
- `KeyName` - наименование ключевого поля в объекте типа `ItemType` (должен быть определен в типе `ItemType`). Тип ключегого поля вычисляется автоматически


Дополнительные атрибуты и методы:
- `protected _storage: Array<BookType>`  - само хранилище объектов (контейнер объектов)
- `protected _fileName: string` - имя файла, в котором будет храниться контейнер
- `protected abstract _getNextId(id: ItemType[KeyName] | null): ItemType[KeyName]` - получение следующего по следованию значения поля идентификатора (используется для поиска ближайшего незанятого)
- `protected _keyName: KeyName` - имя ключевого поля объекта (оно бует иметь тип `KeyName`, фактически значение будет совпадать с типом)
- `protected _dumpToFile()` - сохранение содержимого контейнера `_storage` в JSON-файл `_fileName`
- конструктор  `constructor(fileName: string = "", key: KeyName)` - передаются 2 параметра: имя файла и имя ключевого параметра объекта

Реализованы все методы интерфейса `ItemStorage` для работы с контейнером `_storage` и сохранением всеъ изменений в файле `_filename`.

#### Абстрактный класс "ХРАНИЛИЩЕ НА ОСНОВЕ БД Mongo"

На базе интерфейса `ItemStorage` реализован абстрактный параметризированный класс `StorageDb<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/books/storage/container/storageDb.ts](src/books/storage/container/storageDb.ts).

Параметрические типы данных:
- `ItemType` - тип хранимого объекта
- `ItemTypeDto` - тип элемента для добавления/обновления объекта
- `KeyName` - наименование ключевого поля в объекте типа `ItemType` (должен быть определен в типе `ItemType`). Тип ключегого поля вычисляется автоматически


Дополнительные атрибуты и методы:
- `protected _model: Model<ItemType & Document>` - модель для работы с коллекцией объектов типа `ItemType` в БД Mongo 
- `protected _keyName: KeyName` - имя ключевого поля объекта (оно бует иметь тип `KeyName`, фактически значение будет совпадать с типом)
- `protected abstract _getNextId(id: ItemType[KeyName] | null): ItemType[KeyName]` - получение следующего по следованию значения поля идентификатора (используется для поиска ближайшего незанятого)
- конструктор  `constructor(modelName: mongoose.Model<ItemType & Document & any>, key: KeyName)` - передаются 2 параметра: модель (Mongoose) для работы с БД и имя ключевого параметра объекта

Реализованы все методы интерфейса `ItemStorage` для работы с использвоанием модели `_model`.

#### Реализация контейнеров для хранения книг

Для работы с книгами типа `IBook` реализованы наследники абстрактных классов:
- `BookStorageFile extends StorageFile<IBook, IBookDto, "_id">` - контейнер книг на основе JSON-файла ([src/books/storage/books/bookStorageFile.ts](src/books/storage/books/bookStorageFile.ts))
- `BookStorageDb extends StorageDb<IBook, IBookDto, "_id">` - контейнер книг на основе БД Mongo ([src/books/storage/books/bookStorageDb.ts](src/books/storage/books/bookStorageDb.ts))

В этих классах реализованы конструкторы и аюстрактный метод `_getNextId()`.

Дополительно для `BookStorageDb` реализована модель `BookModel` данных для хранения книг в коллекции БД Mongo ([src/books/storage/books/BookModel.ts](src/books/storage/books/BookModel.ts)).




### Модуль приложения

Модуль `App` импортирует имеющиеся модули `CONFIG` и `BOOKS`. Модуль взят из стандартного NestJS-проекта ([src/app.module.ts](src/app.module.ts)).

В принципе, файлы [src/app.controller.ts](src/app.controller.ts) и [src/app.service.ts](src/app.service.ts) не нужны. Они реализуют тестовый URL-путь `'/'` с текстом 'Hello world!'.


## Основной файл ([src/main.ts](src/main.ts))

Основной файл создает экземпляр модуля `App` и запускает сервер  [src/main.ts](src/main.ts). 

Используется библиотека `Mongoose` для работы с БД MongoDB.


## Запуск


### Запуск с использованием файлового хранилища локально
Для запуска сервера BookStor локально без использования контейнеров необходимо выполнить команду:
- для режима отладки `npm run watch`
- для основного режима `npm run build` и потом `npm run start` 

Проверку можно осуществлять с использованием Postman, браузера или curl.





## Задание
[https://github.com/netology-code/ndtnf-homeworks/tree/master/006-nestjs-ext](https://github.com/netology-code/ndtnf-homeworks/tree/master/006-nestjs-ext)
