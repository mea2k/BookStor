# BOOKSTOR-TS

Backend-сервер "BookStor", написанный на язфке программирования TypeScript на основе NodeJS, ExpressJS, с возможностью использовать в качестве хранилища JSON-файлы или БД Mongo.

Используемые библиотеки: inversify, multer, mongoose.

Код соответствует ВСЕМ (_почти_) требованиям **SOLID**.

Основные возможности сервера:
1. Создание книги (`POST /api/books`).
2. Получение всех книг (`GET /api/books`).
3. Получение книги по ID (`GET /api/books/{id}`)
4. Изменение информации о книге с идентификатором ID (`POST /api/books/{id}`)
5. Удаление книги с идентификатором ID (`DELETE /api/books/{id}`)


## Сущность "КНИГА"

Интерфейс книги `IBook` реализован в файле [src/interfaces/book.ts](src/interfaces/book.ts). Основные параметры интерфейса КНИГА:
- `id: number`     - ID книги **(обязательный параметр)**
- `title: string`  - название книги **(обязательный параметр)**
- `description?: string`  - аннотация книги
- `authors?: string[]` - авторы книги в виде массива строк
- `fileCover?: string`  - имя файла с обложкой книги
- `fileBook?: string`  - имя файла с содержимым книги
 
Обязательным является только поля ID и title!

Для реализации добавления/ихменения информации о книге реализован интерфейс `IBookDto` в файле [src/interfaces/book.ts](src/interfaces/book.ts#L23).


## Параметризированный/шаблонный интерфейс "ХРАНИЛИЩЕ" (generic)

Для реализации контейнеров подготовлен интерфейс с параметрическими типами данных `ItemStorage<ItemType, ItemTdoType, KeyType>` ([src/interfaces/itemStorage.ts](src/interfaces/itemStorage.ts)).

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



## Абстрактный класс "ХРАНИЛИЩЕ НА ОСНОВЕ ФАЙЛА"

На базе интерфейса `ItemStorage` реализован абстрактный параметризированный класс `StorageFile<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/container/storageFile.ts](src/container/storageFile.ts).

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

## Абстрактный класс "ХРАНИЛИЩЕ НА ОСНОВЕ БД Mongo"

На базе интерфейса `ItemStorage` реализован абстрактный параметризированный класс `StorageDb<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/container/storageDb.ts](src/container/storageDb.ts).

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



## Реализация контейнеров для хранения книг

Для работы с книгами типа `IBook` реализованы наследники абстрактных классов:
- `BookStorageFile extends StorageFile<IBook, IBookDto, "_id">` - контейнер книг на основе JSON-файла ([src/container/books/bookStorageFile.ts](src/container/books/bookStorageFile.ts))
- `BookStorageDb extends StorageDb<IBook, IBookDto, "_id">` - контейнер книг на основе БД Mongo ([src/container/books/bookStorageDb.ts](src/container/books/bookStorageDb.ts))

В этих классах реализованы конструкторы и аюстрактный метод `_getNextId()`.

Дополительно для `BookStorageDb` реализована модель `BookModel` данных для хранения книг в коллекции БД Mongo ([src/container/books/BookModel.ts](src/container/books/BookModel.ts)).

## IoC-контейнеризация

Для исключения внутренних зависимостей реализован IoC-контейнер, в котором назодятся все необходимые объекты ([src/container/container.ts](src/container/container.ts)).

Подключаемые к IoC-контейнеру классы помечены декораторами `@injectible` библиотеки `inversify`.


## Основной файл ([index.ts](src/index.ts))

Основной код сервера реализован в файле [src/index.ts](src/index.ts). Используется библиотека `Express` для запуска сервера. Все параметры передаются в теле запросов в виде JSON-объектов, результат работы методов - JSON-данные.

Используется библиотека `Mongoose` для работы с БД MongoDB.

### Инициализация Mongo
В файле [mongo-init.js](mongo-init.js) содержится сценарий, создающий БД `meboard` и все необходимые коллекции (`[ "books", "users" ]`) - задаются в переменной окружения `MONGO_DATABASE_COLLECTIONS` в файле [.env](.env). Также создается пользователь `user:user` для работы с БД `books`. Данный сценарий выполняется один раз при первом запуске контейнера mongo.


## Запуск

### Переменные окружения

Все необходимые параметры задаются в переменных окружения:
- [.env](.env) - полный формат всех переменных окружения
- [mongo.env](mongo.env) - настройки для работы с БД Mongo
- [file.env](file.env) - настройки для работы с JSON-файлами

Файл сборки всех контейнеров - [Docker-compose.yml](Docker-compose.yml).

Файл сборки контейнера сервера BookStor-TS - [Dockerfile](Dockerfile).


### Контейнеры

Основной контейнер - [makevg/bookstor-ts](https://hub.docker.com/repository/docker/makevg/bookstor-ts/general)

Контейнеры для СУБД Mongo:
- [mongo](https://hub.docker.com/_/mongo)
- [mongo-express](https://hub.docker.com/_/mongo-express)

### Запуск с использованием БД Mongo

1. Создать папку для хранения данных (например, `data`).
2. Задать значение параметра `STORAGE_TYPE: mongo` в файле переменных окружения (например, [mongo.env](mongo.env)). 
3. Задать пути до папки из п.1 в файле переменных окружения (например, [mongo.env](mongo.env)).
4. Задать другие необходимые параметры в файле переменных окружения (например, [mongo.env](mongo.env)).
5. Выполнить команду для запуска
```
docker compose  --env-file mongo.env up
```
Если в режиме сборки, то выполнить команду
```
docker compose  --env-file mongo.env up --build
```


### Запуск с использованием файлового хранилища

1. Создать папку для хранения данных (например, `data`).
2. Задать значение параметра `STORAGE_TYPE: file` в файле переменных окружения (например, [file.env](file.env)). 
3. Задать пути до папки из п.1 в файле переменных окружения (например, [file.env](file.env)).
4. Задать другие необходимые параметры в файле переменных окружения (например, [file.env](file.env)).
5. Выполнить команду для запуска
```
docker compose  --env-file file.env up
```
Если в режиме сборки, то выполнить команду
```
docker compose  --env-file file.env up --build
```

Запуск только контейнера BookStor-ts (при работе с файлами):
```
docker run --name bookstor-ts --rm -it -v ~/data:/usr/src/app/data -v ~/public:/usr/src/app/public   -p 3000:3000 --privileged makevg/bookstor-ts npm start 
```

### Запуск с использованием файлового хранилища локально
Для запуска сервера BookStor локально без использования контейнеров необходимо выполнить команду:
- для режима отладки `npm run watch`
- для основного режима `npm run build` и потом `npm run start` 
