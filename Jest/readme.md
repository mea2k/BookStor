# Тестирование с использованием библиотеки Jest


## API сервера

Сервер с аутентификацией, написанный на языке программирования TypeScript с использованием платформы NestJS, с возможностью использовать в качестве хранилища JSON-файлы или БД Mongo. Поддерживается аутентификация по логину и паролю, а также по токену (JWT).

Код соответствует ВСЕМ (_почти_) требованиям **SOLID**.

Основные возможности сервера:
1. Регистрация пользователя (`POST /api/users/signup`).
2. Аутентификация пользователя (`POST /api/users/signin`) - возвращает информацию о залогиненном пользователе
3. Аутентификация пользователя с получением JWT (`POST /api/users/token`) - возвращает JWT.
4. Профиль пользователя (`GET /api/users/profile`) - только после аутентификации (по JWT-токену).
5. Информация о других пользователях (`GET /api/users/{id}`)
6. Получение всех книг (`GET /api/books`).
7. Получение книги по ID (`GET /api/books/{id}`)
8. Создание книги (`POST /api/books`).
9. Обновление книги с идентификатором ID (`PUT /api/books/{id}`).
10. Удаление книги с идентификатором ID (`DELETE /api/books/{id}`)
11. _(дополнительно)_ Получение всех настроек (переменных окружения) (`GET /config`)
12. _(дополнительно)_ Получение значения переменной окружения по имени (`GET /config/{variable}`)
 


## Тестирование

Для проведения тестирования созданы файлы:
1. Unit-тесты сервиса модуля BOOKS ([books.service.unit-test.ts](test/books/books.service.unit-test.ts))
2. E2E-тесты контроллера BOOKS ([books.controller.e2e-test.ts](test/books/books.controller.e2e-test.ts))


### Запуск тестов
1. `npm run test` - запуск тестов.
2. `npm run testwatch` - запуск тестов в режиме мониторинга изменения файлов.
3. `npm run testcov` - запуск тестов в режиме покрытия.
4. `npm run testdebug` - запуск в режиме отладки.
5. `npm run teste2e` - запуск E2E-тестов.



## Модули

В приложении реализованы следующие модули:
1. `CONFIG` ([src/modules/config/config.module.ts](src/modules/config/config.module.ts)) - настройки функционирования приложения.
2. `USERS`  ([src/modules/users/users.module.ts](src/modules/users/users.module.ts)) - работа с пользователями (добавление, хранение, запросы).
3. `AUTH`  ([src/modules/auth/auth.module.ts](src/modules/auth/auth.module.ts)) - аутентификация пользователей и формирование JWT.
4. `APP`  ([src/app.module.ts](src/app.module.ts)) - само приложение.


### Модуль "CONFIG"

Модуль `CONFIG` содержит все настройки функционирования приложения и других модулей. Реализован на основе стандартного модуля `ConfigModule`. Все настройки подгружаются в качестве переменных окружения (`process.env`) из файла [.env](.env).

Имя файла можно изменить, задав переменную окружения `process.env.CONFIG_FILE`. 

Все возможные параметры описаны в интерфейсе `IConfig` ([src/modules/config/config.interfaces.ts](src/modules/config/config.interfaces.ts)).


**Контроллер модуля** - `ConfigController` ([src/modules/config/config.controller.ts](src/modules/config/config.controller.ts)):
- реализует обработку URL-путей:
  * `/config` с вызовом метода `getAll()` у класса `ConfigService`
  * `/config/{key}` с вызовом метода `get(key)` у класса `ConfigService`

Модуль `CONFIG` ([src/modules/config/config.module.ts](src/modules/config/config.module.ts)) экспортирует класс `ConfigService`, который является инжектируемым (`@Injected()`) в провайдеры других модулей. При этом создается всегда не более одного экземпляра объекта `ConfigService`. При его создании он существует все время функционирования приложения (`{ scope: Scope.DEFAULT }`).


### Модуль "USERS"

Модуль `USERS` содержит весь функционал по работе с пользователями. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService` ([src/modules/users/users.module.ts](src/modules/users/users.module.ts)).


#### Контроллер модуля

Контроллер модуля - `UsersController` ([src/modules/users/users.controller.ts](src/modules/users/users.controller.ts)) реализует обработку URL-путей:
- `POST /api/users/signup` - регистрация пользователя
- `GET /api/users/profile` - профиль пользователя (использует `AuthGuard` для проверки авторизации - [src/modules/auth/auth.guard.ts](src/modules/auth/auth.guard.ts))
- `GET /api/users/{id}` - информация о выбранном пользователе
- `DELETE /api/users/{id}` - удаление пользователя


#### Валидация входных данных

Для проверки корректности входных данных при регистрации пользователя реализован валидатор `UsersDtoValidator` ([src/modules/users/validators/usersDtoValidator.ts](src/modules/users/validators/usersDtoValidator.ts)).


#### Контейнеры для хранения пользователей

Для работы с объектами типа `IUser` реализованы наследники абстрактных классов:
- `UserStorageFile extends StorageFile<IUSer, IUSerDto, '_id'>` - контейнер пользователей на основе JSON-файла ([src/modules/users/storage/userStorageFile.ts](src/modules/users/storage/userStorageFile.ts))
- `UserStorageDb extends StorageDb<UserDocument, IUSerDto, '_id'>` - контейнер пользователей на основе БД Mongo ([src/modules/users/storage/userStorageDb.ts](src/modules/users/storage/userStorageDb.ts))

В этих классах реализованы конструкторы и абстрактный метод `_getNextId()`.

Дополнительно реализован метод `getByLogin(login: IUSer['login'])`, осуществляющий поиск пользователей в хранилище по логину.


Для работы с БД Mongo реализована схема данных `UserSchema` ([src/modules/users/storage/userSchema.ts](src/modules/users/storage/userSchema.ts)).


### Модуль "AUTH"

Модуль `AUTH` содержит весь функционал по аутентификации пользователей. Модуль импортирует модули `CONFIG`, `UsersModule`, а также модуль генерации JWT - `JwtModule` ([src/modules/auth/auth.module.ts](src/modules/auth/auth.module.ts)).


#### Контроллер модуля

Контроллер модуля - `AuthController` ([src/modules/auth/auth.controller.ts](src/modules/auth/auth.controller.ts)) реализует обработку URL-путей:
- `POST /api/users/signin` - авторизация пользователя
- `POST /api/users/token` - авторизация с получением токена JWT


#### Валидация входных данных

Для проверки корректности входных данных при авторизации пользователя реализован валидатор `UserAuthValidator` ([src/modules/auth/validators/userAuthValidator.ts](src/modules/auth/validators/userAuthValidator.ts)).


#### Авторизация по JWT

Для прохождения авторизации по токену и подключения информации о пользователе в глобальный запрос Request, используется механизм `Guard` ([src/modules/auth/auth.guard.ts](src/modules/auth/auth.guard.ts)).
В нем осуществляется расшифровка JWT с использованием секретного ключа, далее проверка на валидность и извлечение данных о пользователе.


#### Генерация JWT

Для генерации JWT используются переменные окружения, подгружаемые из модуля `CONFIG`:
- `JWT_SECRET` - секретное слово токена
- `JWT_EXPIRE` - время жизни токена

Данные переменные задаются в файле .env при запуске.


### Модуль "BOOKS"

Модуль `BOOKS` содержит весь функционал по работе с книгами. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService` ([src/modules/books/books.module.ts](src/modules/books/books.module.ts)).


#### Провайдеры модуля

1. `BooksService` - ([src/modules/books/books.service.ts](src/modules/books/books.service.ts)):
- создает хранилище на основании параметров модуля CONFIG (параметр `STORAGE_TYPE` - {`file|mongo`})
- вызывает методы хранилища (`getAll`, `get(id)`, `create(item)`, `update(id,item)`, `delete(id)`)
2. `BookStorageDb` - хранилище на основе БД Mongo - инжектируется в качестве хранилища в BookService, если `STORAGE_TYPE = 'mongo'`.
3. `BookStorageFile` - хранилище на основе JSON-файла - инжектируется в качестве хранилища в BookService, если `STORAGE_TYPE = 'file'` (по умолчанию).

#### Контроллер модуля

Контроллер модуля - `BooksController` ([src/modules/books/books.controller.ts](src/modules/ooks/books.controller.ts)):
- реализует обработку URL-путей `/api/books/` с вызовом различных методов  у класса `booksService`



#### Интерфейс IBOOK

Интерфейс книги `IBook` реализован в файле [src/modules/books/books.interfaces.ts](src/modules/books/books.interfaces.ts). Для реализации добавления/ихменения информации о книге реализован интерфейс `IBookDto` в файле [src/modules/books/books.interfaces.ts](src/modules/books/books.interfaces.ts#L37).



### Модуль приложения

Модуль `App` импортирует имеющиеся модули `CONFIG`, `USERS`, `AUTH`. Модуль взят из стандартного NestJS-проекта ([src/app.module.ts](src/app.module.ts)).

В принципе, файлы [src/app.controller.ts](src/app.controller.ts) и [src/app.service.ts](src/app.service.ts) не нужны. Они реализуют тестовый URL-путь `'/'` с текстом 'Hello world!'.


## Основной файл ([src/main.ts](src/main.ts))

Основной файл создает экземпляр модуля `App` и запускает сервер  [src/main.ts](src/main.ts). 

Используется библиотека `Mongoose` для работы с БД MongoDB.



## Хранилище

### Параметризированный/шаблонный интерфейс "ХРАНИЛИЩЕ" (generic)

Для реализации контейнеров подготовлены абстрактные классы интерфейс с параметрическими типами данных `ItemStorage<ItemType, ItemTdoType, KeyType>` ([src/interfaces/itemStorage.ts](src/interfaces/itemStorage.ts)).

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

### Абстрактный класс "ХРАНИЛИЩЕ НА ОСНОВЕ ФАЙЛА"

На базе интерфейса `ItemStorage` реализован абстрактный параметризированный класс `StorageFile<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/storage/storageFile.ts](src/storage/storageFile.ts).


Параметрические типы данных:
- `ItemType` - тип хранимого объекта
- `ItemTypeDto` - тип элемента для добавления/обновления объекта
- `KeyName` - наименование ключевого поля в объекте типа `ItemType` (должен быть определен в типе `ItemType`). Тип ключевого поля вычисляется автоматически


Дополнительные атрибуты и методы:
- `protected _storage: Array<ItemType>`  - само хранилище объектов (контейнер объектов)
- `protected _fileName: string` - имя файла, в котором будет храниться контейнер
- `protected _keyName: KeyName` - имя ключевого поля объекта (оно будет иметь тип `KeyName`, фактически значение будет совпадать с типом)
- `protected _debug: boolean` - флаг отладки (если true - в консоль выдается дополнительная информация)
- `protected abstract _getNextId(id: ItemType[KeyName] | null): ItemType[KeyName]` - получение следующего по следованию значения поля идентификатора (используется для поиска ближайшего незанятого)
- `protected _dumpToFile()` - сохранение содержимого контейнера `_storage` в JSON-файл `_fileName`
- конструктор  `constructor(fileName: string, key: KeyName, debug = true) ` - передаются 3 параметра: имя файла, имя ключевого параметра объекта и значение флага отладки

Реализованы все методы интерфейса `ItemStorage` для работы с контейнером `_storage` и сохранением всех изменений в файле `_filename`.


### Абстрактный класс "ХРАНИЛИЩЕ НА ОСНОВЕ БД Mongo"

На базе интерфейса `ItemStorage` реализован абстрактный параметризированный класс `StorageDb<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/storage/storageDb.ts](src/storage/storageDb.ts).

Параметрические типы данных:
- `ItemType` - тип хранимого объекта
- `ItemTypeDto` - тип элемента для добавления/обновления объекта
- `KeyName` - наименование ключевого поля в объекте типа `ItemType` (должен быть определен в типе `ItemType`). Тип ключевого поля вычисляется автоматически


Дополнительные атрибуты и методы:
- `protected _model: mongoose.Model<ItemType & Document>` - модель для работы с коллекцией объектов типа `ItemType` в БД Mongo 
- `protected _keyName: KeyName` - имя ключевого поля объекта (оно будет иметь тип `KeyName`, фактически значение будет совпадать с типом)
- `protected _debug: boolean` - флаг отладки (если true - в консоль выдается дополнительная информация)
- `protected abstract _getNextId(id: ItemType[KeyName] | null): ItemType[KeyName]` - получение следующего по следованию значения поля идентификатора (используется для поиска ближайшего незанятого)
- конструктор  `constructor(model: Model<ItemType>, key: KeyName, debug = true)` - передаются 3 параметра: модель (Mongoose) для работы с БД, имя ключевого параметра объекта 

Реализованы все методы интерфейса `ItemStorage` для работы с использованием модели `_model`.



## Запуск

### Переменные окружения

Все необходимые параметры приложения задаются в переменных окружения:
- [.env](.env) - полный формат всех переменных окружения
- [mongo.env](mongo.env) - настройки для работы с БД Mongo
- [file.env](file.env) - настройки для работы с JSON-файлами

Файл сборки всех контейнеров - [Docker-compose.yml](Docker-compose.yml).

Файл сборки контейнера `auth-jwt` - [Dockerfile](Dockerfile).

Сам контейнер доступен по ссылке: [https://hub.docker.com/repository/docker/makevg/auth-jwt/general](https://hub.docker.com/repository/docker/makevg/auth-jwt/general).


### Запуск в режиме контейнера с использованием БД Mongo

Контейнеры для СУБД Mongo *(нужны только в режиме работы с БД Mongo)*:
- [mongo](https://hub.docker.com/_/mongo)
- [mongo-express](https://hub.docker.com/_/mongo-express)

__Порядок действий:__
1. Создать папку для хранения данных (например, `data`).
2. Создать папку для загрузки данных (например, `public`).
3. Задать значение параметра `STORAGE_TYPE: mongo` в файле переменных окружения (например, [mongo.env](mongo.env#L29)). 
4. Задать пути до папок из п.1,2 в файле переменных окружения (например, [mongo.env](mongo.env#L26)).
5. Задать другие необходимые параметры в файле переменных окружения (например, [mongo.env](mongo.env)).
6. Задать в файле переменных окружения параметры JWT-токена (`JWT_SECRET`, `JWT_EXPIRE`)
7. Выполнить команду для запуска
```
docker compose  --env-file mongo.env up
```
Если в режиме сборки, то выполнить команду
```
docker compose  --env-file mongo.env up --build
```

#### Инициализация Mongo
В файле [mongo-init.js](mongo-init.js) содержится сценарий, создающий БД `MONGO_INITDB_DATABASE` и все необходимые коллекции (`MONGO_DATABASE_COLLECTIONS`), заданные в файле [.env](.env). Также создается пользователь `MONGO_USERNAME:MONGO_USERNAME` для работы с БД. Данный сценарий выполняется один раз при первом запуске контейнера mongo.





### Запуск в режиме контейнера с использованием файлового хранилища

1. Создать папку для хранения данных (например, `data`).
2. Создать папку для загрузки данных (например, `public`).
3. Задать значение параметра `STORAGE_TYPE: file` в файле переменных окружения (например, [file.env](file.env#L8)). 
4. Задать пути до папок из п.1,2 в файле переменных окружения (например, [file.env](file.env#L5)).
5. Задать другие необходимые параметры в файле переменных окружения (например, [file.env](file.env)).
6. Задать в файле переменных окружения параметры JWT-токена (`JWT_SECRET`, `JWT_EXPIRE`)
7. Выполнить команду для запуска
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
3. Скопировать файл `file.env` по пути, не содержащим пробелов (например, `d:/file.env`)
2. Выполнить команду для запуска
```
docker run --name auth-jwt --rm -it -v ~/data:/usr/src/app/data -v ~/public:/usr/src/app/public --mount type=bind,source=d:/file.env,target=/usr/src/app/file.env,readonly  --env=CONFIG_FILE=./file.env -p 3000:3000 --privileged makevg/auth-jwt npm start 
```




### Запуск без контейнеров (только в режиме файлового хранилища)

Для запуска сервера локально без использования контейнеров необходимо выполнить команду:
- для режима отладки `npm run watch`
- для основного режима `npm run build` и потом `npm run start` 



## Проверка работы

Для проверки работоспособности можно воспользоваться:
1. Программой `PostMan`.
2. Программной `curl`.
3. Файлом [requests.http](requests.http) в среде VSCode с установленным расширением `REST Client`.


# Задание
[https://github.com/netology-code/ndtnf-homeworks/tree/master/011-nestjs-authentication](https://github.com/netology-code/ndtnf-homeworks/tree/master/011-nestjs-authentication)

















## Задание
[https://github.com/netology-code/ndtnf-homeworks/tree/master/012-Test-Jest](https://github.com/netology-code/ndtnf-homeworks/tree/master/012-Test-Jest)
