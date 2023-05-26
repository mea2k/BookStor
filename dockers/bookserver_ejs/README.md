# КОЛЛЕКЦИЯ КНИГ - СЕРВЕР ШАБЛОНОВ НА ОСНОВЕ EJS

## Описание

Сервер __"Коллекция книг - шаблоны EJS"__ содержит следующие страницы:
1. Главная страница (`/`).
2. Cписок хранимых книг (`/books`).
3. Информация о выбранной книге (`/books/:id`).
4. Добавление книги в коллекцию (`/books/add`).
5. Изменение информации о книге из коллекции (`/books/edit/:id`).
6. Скачивание файла с содержимым книги (`/books/:id/download`).
8. Удаление книги из коллекции (`/books/delete/:id`).

Загруженные книги сохраняются в заданной папке. Папку можно задать переменными окружения (`DATA_PATH`) или в конфигурационном файле ([config.json](config.json)).


## Маршруты ([routes](src/routes))

### Главный путь `/` ([routes/index.js](src/routes/index.js))

`/` - главная страница ([код](src/routes/index.js#L12)). Используется шаблон [pages/index.ejs](src/views/pages/index.ejs).


### Пути `/books` ([routes/books/index.js](src/routes/books/index.js))

`/books` - отображение списка книг ([код](src/routes/books/index.js#L22)). Используется шаблон [pages/books/index.ejs](src/views/pages/books/index.ejs).
Используется API-метод `GET /api/books` сервера `bookserver_api`.

`/books/add` - добавление новой книги с возможностью загрузки файла ([код](src/routes/books/index.js#L82)). Используется форма из шаблона [pages/books/add_edit.ejs](src/views/pages/books/add_edit.ejs).
Используется API-метод `POST api/books` сервера `bookserver_api`. Загружаемый файл сохраняется в папке, заданной в настройках.

`/books/:id` - отображение информации о книге с идентификатором `id` ([код](src/routes/books/index.js#L144)). Используется шаблон [pages/books/view.ejs](src/views/pages/books/view.ejs).
Используется API-метод `GET /api/books/:id` сервера `bookserver_api`. 

`/books/edit/:id` - редактирование информации о книге новой книги с идентификатором `id` ([код](src/routes/books/index.js#L227)). Используется форма из шаблона [pages/books/add_edit.ejs](src/views/pages/books/add_edit.ejs).
Используется API-метод `PUT api/books/:id` сервера `bookserver_api`. Загружаемый файл сохраняется в папке, заданной в настройках.

`/books/:id/download` - скачивание файла для выбранной книги с идентификатором `id` ([код](src/routes/books/index.js#L285)).
Используется API-метод `GET /api/books/:id` сервера `bookserver_api`. Извлекается имя сохраненного файла, и он выдается для скачивания. Сам файл сохраняется в папке, заданной в настройках.

`/books/delete/:id` - удаление книги с идентификатором `id` ([код](src/routes/books/index.js#L324)). 
Используется API-метод `DELETE /api/books/:id` сервера `bookserver_api`. После удаления идет перенаправление на страницу `/books`.


### Пути `/counters` ([routes/books/counter.js](src/routes/books/counter.js))

В файле [routes/books/counter.js](src/routes/books/counter.js) реализованы функции:
- `getCounter(bookId)` - получение счетчика скачиваний книги с идентификатором `bookId` ([код](src/routes/books/counter.js#L9)),
- `incCounter(bookId)` - увеличение счетчика скачиваний книги с идентификатором `bookId` на 1 ([код](src/routes/books/counter.js#L35)),
- `delCounter(bookId)` - удаление счетчика скачиваний книги с идентификатором `bookId` ([код](src/routes/books/counter.js#L46)).

Данные функции используют API-методы сервера `bookserver_counter`.

## Промежуточные обработчики ([middleware](src/middleware))

### Обработка загрузки файлов ([middleware/fileMulter.js](src/middleware/fileMulter.js))
Для загрузки фалов используется библиотека `Multer`. Обработчик сохрняет загружаемые файлы в папке, которая задается в конфигурационном файле ([config.json](config.json)) или в переменных окружения.

Имя файлов - `ID_DATE.ext`.


## Основной файл ([index.js](src/index.js))

Основной код сервера реализован в файле [index.js](src/index.js). Используется библиотека `Express` для запуска сервера и шаблонизатор `EJS`. Все параметры передаются в теле запросов в виде JSON-объектов, результат работы методов - JSON-данные.


## Запуск

### Запуск локально

Запуск в режиме отладки:
```
npm run watch
```

Запуск для работы:
```
npm start
```

### Запуск в docker-е

Готовый образ - [makevg/bookstor_ejs](https://hub.docker.com/repository/docker/makevg/bookstor_ejs/general)

ля сборки используются:
  - [Dockerfile](Dockerfile) для релиза 
  - [Dockerfile_debug](Dockerfile_debug) для отладки

Сборка docker-а:
```
docker build .
```

ИЛИ

```
docker build -f Dockerfile_debug .
```

### Переменные среды

Параметры запуска задаются либо в файле [config.json](config.json) или в переменных окружения, заданных в файле [docker-compose.yml](../docker-compose.yml)

Пример содержимого конфигурационного файла:
```
{
    "hostname": "bookserver_ejs",
    "port": 3000,
    "data_path": "../data/fileBook",
    "api_server": "localhost",
    "api_port": 5000,
    "counter_server": "localhost",
    "counter_port": 5010
}
```

Пример задания через переменные окружения:
```
      NODE_ENV: production
      HOSTNAME: bookserver_ejs
      PORT: 3000
      DATA_PATH: ../data/fileBook
      API_SERVER: bookstorapi
      API_PORT: 5000
      COUNTER_SERVER: bookstorcounter
      COUNTER_PORT: 5010
```

Порт по умолчанию: __3000__.

Функционал зависим от серверов:
- `bookserver_api`
- `bookserver_counter`

### Приоритетность параметров

Приоритетность параметров запуска:

1. Переменные окружения (`process.env`).
2. Конфигурационный файл ([config.json](config.json)).
3. Значения по умолчанию (заданы в коде).
