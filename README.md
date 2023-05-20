# КОЛЛЕКЦИЯ КНИГ - ПОЛНОЦЕННОЕ КЛИЕНТ-СЕРВЕРНОЕ ПРИЛОЖЕНИЕ

## Описание

Приложение __"Коллекция книг"__ предоставляет следующие возможности (API):
1. Авторизация пользователя.
2. Получение списка хранимых книг.
3. Получение информации об отдельной книге.
4. Добавление книги в коллекцию.
5. Изменение информации о книге из коллекции.
6. Загрузка файла с содержимым книги.
7. Скачивание файла с содержимым книги.
8. Удаление книги из коллекции.
9. Просмотр числа скачиваний по каждой книге с вуказанием времени последнего скачивания.

Приложение поддерживает сохранение состояния при выключении (запись в файл).

## Компоненты приложения

Приложкение состоит из 3-х компонент (docker-образов)
1. API-server ([bookserver_api](bookserver_api)).
2. Сервер счетчиков ([bookserver_counter](bookserver_counter)).
3. Сервер шаблонизации ([bookserver_ejs](bookserver_ejs)).


## Docker-образы

Все компоненты приложения реализованы в docker-образах:
1. API-server
  - [bookstor_api[:latest]](https://hub.docker.com/repository/docker/makevg/bookstor_api/general) - основной
  - [bookstor_api:debug](https://hub.docker.com/repository/docker/makevg/bookstor_api/general) - для отладки
2. Сервер счетчиков
  - [bookstor_counter[:latest]](https://hub.docker.com/repository/docker/makevg/bookstor_counter/general) - основной
  - [bookstor_counter:debug](https://hub.docker.com/repository/docker/makevg/bookstor_counter/general) - для отладки
3. Сервер шаблонизации
  - [bookstor_ejs[:latest]](https://hub.docker.com/repository/docker/makevg/bookstor_ejs/general) - основной
  - [bookstor_ejs:debug](https://hub.docker.com/repository/docker/makevg/bookstor_ejs/general) - для отладки


## Запуск

### Запуск рабочей версии

1. Создать папку для хранения данных (например, `data`).
2. В файле [docker-compose.yml](docker-compose.yml) добавить переменные окружения `DATA_PATH` с указанием пути до папки из п.1 для контейнеров `bookstorapi`, `bookstorcounter`, `bookstorejs`.
3. В файле [docker-compose.yml](docker-compose.yml) задать в переменной окружения `PORT` порты для контейнеров:
  - `bookstorapi` - по умолчанию 5000,
  - `bookstorcounter` - по умолчанию 5010,
  - `bookstorejs` - по умолчанию 3000.
4. В файле [docker-compose.yml](docker-compose.yml) в блоке описания сервера шаблонизации (`bookstorejs`) задать имена и порты других зависимых контейнеров (`API_SERVER`, `API_PORT`, `COUNTER_SERVER`, `COUNTER_PORT`) значениями из п.3.
5. В файле [docker-compose.yml](docker-compose.yml) в блоке описания сервера шаблонизации (`bookstorejs`) задать порт проброса с хоста (например, `ports: [ 80:3000 ]`).
5. Выполнить команду
```
docker compose up
```

### Запуск в режиме отладки

1. Отредактировать файл [docker-compose.debug.yml](docker-compose.debug.yml) как в предыдущем параграфе.
2. Выполнить команду
```
docker compose -f docker-compose.debug.yml up
```
