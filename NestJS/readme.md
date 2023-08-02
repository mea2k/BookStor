# BookStor с использованием NestJS

Backend-сервер "BookStor", написанный на языке программирования TypeScript с использованием платформы NestJS, с возможностью использовать в качестве хранилища JSON-файлы или БД Mongo.

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

Модуль `CONFIG` содержит все настройки функционирования приложения и других модулей (например, модуля `BOOKS`). Реализован на основе стандартного модуля `ConfigModule`. Все настройки подгружабтся в качестве переменных окружения (`process.env`) из файла [.env](.env).

Имя файла можно изменить, задав переменную окружения `process.env.CONFIG_FILE`. 

Все возможные параметры описаны в интерфейсе `IConfig` ([src/config/interfaces/config.ts](src/config/interfaces/config.ts)).

**Провайдер модуля** - `ConfigService` ([src/config/config.service.ts](src/config/config.service.ts)):
- заполняет все значения параметров из значений по умолчанию, переменных окружения
- позволяет получить значение параметра по ключу (метод [get()](src/config/config.service.ts#L51))
- позволяет получить значения всех параметров (метод [getAll()](src/config/config.service.ts#L58))

**Контроллер модуля** - `ConfigController` ([src/config/config.controller.ts](src/config/config.controller.ts)):
- реализует обработку URL-путей:
  * `/config` с вызовом метода `getAll()` у класса `ConfigService`
  * `/config/{key}` с вызовом метода `get(key)` у класса `ConfigService`

Модуль `CONFIG` ([src/config/config.module.ts](src/config/config.module.ts)) экспортирует класс `ConfigService`, который является инжектируемым (`@Injected()`) в провайдеры других модулей. При этом создается всегда не более одного экземпляра объекта `ConfigService`. При его создании он существует все время функционирования приложения (`{ scope: Scope.DEFAULT }`).


### Модуль "BOOKS"

Модуль `BOOKS` содержит весь функционал по работе с книгами. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService` ([src/books/books.module.ts](src/books/books.module.ts)).


#### Провайдеры модуля

1. `BooksService` - ([src/books/books.service.ts](src/books/books.service.ts)):
- создает хранилище на основании параметров модуля CONFIG (параметр `STORAGE_TYPE` - {`file|mongo`})
- вызывает методы хранилища (`getAll`, `get(id)`, `create(item)`, `update(id,item)`, `delete(id)`)
2. `BookStorageDb` - хранилище на основе БД Mongo - инжектируется в качестве хранилища в BookService, если `STORAGE_TYPE = 'mongo'`.
3. `BookStorageFile` - хранилище на основе JSON-файла - инжектируется в качестве хранилища в BookService, если `STORAGE_TYPE = 'file'` (по умолчанию).

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
- `protected _model: mongoose.Model<ItemType & Document>` - модель для работы с коллекцией объектов типа `ItemType` в БД Mongo 
- `protected _keyName: KeyName` - имя ключевого поля объекта (оно бует иметь тип `KeyName`, фактически значение будет совпадать с типом)
- `protected abstract _getNextId(id: ItemType[KeyName] | null): ItemType[KeyName]` - получение следующего по следованию значения поля идентификатора (используется для поиска ближайшего незанятого)
- конструктор  `constructor(modelName: mongoose.Model<ItemType & Document & any>, key: KeyName)` - передаются 2 параметра: модель (Mongoose) для работы с БД и имя ключевого параметра объекта

Реализованы все методы интерфейса `ItemStorage` для работы с использвоанием модели `_model`.

#### Реализация контейнеров для хранения книг

Для работы с книгами типа `IBook` реализованы наследники абстрактных классов:
- `BookStorageFile extends StorageFile<IBook, IBookDto, "_id">` - контейнер книг на основе JSON-файла ([src/books/storage/books/bookStorageFile.ts](src/books/storage/books/bookStorageFile.ts))
- `BookStorageDb extends StorageDb<BookDocument, IBookDto, "_id">` - контейнер книг на основе БД Mongo ([src/books/storage/books/bookStorageDb.ts](src/books/storage/books/bookStorageDb.ts))

В этих классах реализованы конструкторы и абстрактный метод `_getNextId()`.

Дополительно для `BookStorageDb` реализована схема данных `BookSchema` данных для хранения книг в коллекции БД Mongo ([src/books/storage/books/bookSchema.ts](src/books/storage/books/bookSchema.ts)).


### Модуль приложения

Модуль `App` импортирует имеющиеся модули `CONFIG` и `BOOKS`. Модуль взят из стандартного NestJS-проекта ([src/app.module.ts](src/app.module.ts)).

В принципе, файлы [src/app.controller.ts](src/app.controller.ts) и [src/app.service.ts](src/app.service.ts) не нужны. Они реализуют тестовый URL-путь `'/'` с текстом 'Hello world!'.


## Основной файл ([src/main.ts](src/main.ts))

Основной файл создает экземпляр модуля `App` и запускает сервер  [src/main.ts](src/main.ts). 

Используется библиотека `Mongoose` для работы с БД MongoDB.


## Запуск

### Переменные окружения

Все необходимые параметры приложения задаются в переменных окружения:
- [.env](.env) - полный формат всех переменных окружения
- [mongo.env](mongo.env) - настройки для работы с БД Mongo
- [file.env](file.env) - настройки для работы с JSON-файлами

Файл сборки всех контейнеров - [Docker-compose.yml](Docker-compose.yml).

Файл сборки контейнера `Bookstor-ts` - [Dockerfile](Dockerfile).

Сам контейнер доступен по ссылке: [https://hub.docker.com/repository/docker/makevg/bookstor-ts/general](https://hub.docker.com/repository/docker/makevg/bookstor-ts/general).

### Контейнеры

Основной контейнер - [makevg/Bookstor-ts](https://hub.docker.com/repository/docker/makevg/bookstor-ts/general)

Контейнеры для СУБД Mongo *(нужны только в редиме работы с БД Mongo)*:
- [mongo](https://hub.docker.com/_/mongo)
- [mongo-express](https://hub.docker.com/_/mongo-express)

### Запуск в режиме контейнера с использованием БД Mongo

1. Создать папку для хранения данных (например, `data`).
2. Создать папку для загрузки данных (например, `public`).
3. Задать значение параметра `STORAGE_TYPE: mongo` в файле переменных окружения (например, [mongo.env](mongo.env#L29)). 
4. Задать пути до папок из п.1,2 в файле переменных окружения (например, [mongo.env](mongo.env#L26)).
5. Задать другие необходимые параметры в файле переменных окружения (например, [mongo.env](mongo.env)).
6. Выполнить команду для запуска
```
docker compose  --env-file mongo.env up
```
Если в режиме сборки, то выполнить команду
```
docker compose  --env-file mongo.env up --build
```

#### Инициализация Mongo
В файле [mongo-init.js](mongo-init.js) содержится сценарий, создающий БД `MONGO_INITDB_DATABASE` и все необходимые коллекции (`MONGO_DATABASE_COLLECTIONS`), заданные в файде [.env](.env). Также создается пользователь `MONGO_USERNAME:MONGO_USERNAME` для работы с БД. Данный сценарий выполняется один раз при первом запуске контейнера mongo.





### Запуск в режиме контейнера с использованием файлового хранилища

1. Создать папку для хранения данных (например, `data`).
2. Создать папку для загрузки данных (например, `public`).
3. Задать значение параметра `STORAGE_TYPE: file` в файле переменных окружения (например, [file.env](file.env#L8)). 
4. Задать пути до папок из п.1,2 в файле переменных окружения (например, [file.env](file.env#L5)).
5. Задать другие необходимые параметры в файле переменных окружения (например, [file.env](file.env)).
6. Выполнить команду для запуска
```
docker compose  --env-file file.env up
```
Если в режиме сборки, то выполнить команду
```
docker compose  --env-file file.env up --build
```

### Запуск локально с использованием файлового хранилища

1. Создать папку для хранения данных (например, `data`).
2. Создать папку для загрузки данных (например, `public`).
3. Скопировать файл `file.env` по пути, не сожержащим пробелов (например, `d:/file.env`)
2. Выполнить команду для запуска
```
docker run --name bookstor-ts --rm -it -v ~/data:/usr/src/app/data -v ~/public:/usr/src/app/public --mount type=bind,source=d:/file.env,target=/usr/src/app/file.env,readonly  --env=CONFIG_FILE=./file.env -p 3000:3000 --privileged makevg/bookstor-ts npm start 
```








## Задание
[https://github.com/netology-code/ndtnf-homeworks/tree/master/006-nestjs-ext](https://github.com/netology-code/ndtnf-homeworks/tree/master/006-nestjs-ext)
