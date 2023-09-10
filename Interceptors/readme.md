# Interceptors and Pipes in NestJS

## BookStor-Interceptor

Подробное описание проекта содержится в проекте [BookStor/NestJS](https://github.com/mea2k/BookStor/blob/main/NestJS/readme.md).


## Задание 1 - Interceptor

Созданы перехватчики запросов к серверу [interceptors](src/interceptors/):
- журналирование - `LoggerInterceptor` ([src/interceptors/logger.ts](src/interceptors/logger.ts));
- обертка выходных JSON-данных - `WrapperInterceptor` ([src/interceptors/wrapper.ts](src/interceptors/wrapper.ts)).

### Журналирование

Перехватчик [LoggerInterceptor](src/interceptors/logger.ts) на каждый вызванный метод формирует строку вида:
```
Модуль - метод: результат (время мс)
```
Например,
```
AppController - getHello: success (1 ms)
```

`LoggerInterceptor` подключается __глобально__ в файле [src/main.ts](src/main.ts#L9).

### Обертка выходных файлов

Перехватчик [WrapperInterceptor](src/interceptors/wrapper.ts) сформированные модулем данные (Response) преобразует в JSON-файл следующего вида:
```
{
    status: "success",
    data: ... // данные из контроллера
}
```

При запросе с ошибкой:
```
{
    status: "fail",
    data: ... // сведения об ошибке
}
```

`WrapperInterceptor` подключается только к модулю приложения `App` ([app.controller.ts](src/app.controller.ts#L5)).


**Проверочные запросы:** 
```
GET /
GET /api/books
GET /api/books/3
```



**UPDATE**
_В перехватчиках закомментированы блоки обработки исключения, чтобы срабатывал фильтр из задания 4!_


## Задание 2 - валидация входных данных из форм

Для получения данных из GET-запросов добавлено использование методов валидации данных (`@Param()`, `@Body()`).


### Валидация URL-параметров

Проверка URL-строки и извлечение параметров осуществляется в модуле `Books`. ID книги должно быть числом. Для проверки используется конструкция `@Param('id', ParseIntPipe)` в модуле [Books](src/modules/books/books.controller.ts#L32).

**Проверочные запросы:** 
```
GET /api/books/3
GET /api/books/not-number
```

### Валидация данных формы

При изменении параметров существующей книги используется класс валидации формы `BooksDtoValidator` ([src/modules/books/validators/booksDtoValidator.ts](src/modules/books/validators/booksDtoValidator.ts)).

В форме обязательным является поле `title`. 

Пордключение класса валидации осуществляется индивидуально к каждому методу модуля [Books](src/modules/books/books.controller.ts#L50).

**Проверочные запросы:** 
```
PUT /api/books/3 + JSONBody {title: 'aaa', authors: ["Auth1", "Auth2"]}
PUT /api/books/3 + JSONBody {no_title: 'aaa', authors: ["Auth1", "Auth2"]}
```


## Задание 3 - валидация входных данных из форм с использованием Joi

Для проверки корректности заполнения форм добавлено использование библиотеки Joi.

### Валидация данных формы

При добавлении новой книги используется класс валидации формы `BooksDtoJoiValidator` ([src/modules/books/validators/booksDtoJoiValidator.ts](src/modules/books/validators/booksDtoJoiValidator.ts)).

В форме обязательным является поле `title`. 

Пордключение класса валидации осуществляется индивидуально к каждому методу модуля [Books](src/modules/books/books.controller.ts#L39).

**Проверочные запросы:** 
```
POST /api/books + JSONBody {title: 'aaa', authors: ["Auth1", "Auth2"]}
POST /api/books + JSONBody {no_title: 'aaa', authors: ["Auth1", "Auth2"]}
```


## Задание 4 - обработка ошибок

В проекте реализован обработчик ошибки `HttpException` с использованием методов фильтрации NestJS.

Обработчик ошибки реализован в классе `HttpExceptionFilter` ([src/exceptions/http.exception.ts](src/exceptions/http.exception.ts)).

При возникновении ошибки формируется следующая JSON-структура:
```
{
    timestamp: ..., // дата и время
    status: "fail",
    data: ..., // сведения об ошибке
    code: ..., // код ошибки при наличии в объекте ошибки. В случае отсутствия, по умолчанию code = 500
}
```

`HttpExceptionFilter` подключается __глобально__ в файле [src/main.ts](src/main.ts#L11).


**Проверочные запросы:** 
```
GET / (1 из 4-х запросов вызывает ошибку)
```

Также можно воспользоваться любыми некорректными запросами из предыдущих заданий


## Запуск проекта

### Запуск локально с использованием файлового хранилища и докера

1. Создать папку для хранения данных (например, `data`).
2. Создать папку для загрузки данных (например, `public`).
3. Скопировать файл `file.env` по пути, не сожержащим пробелов (например, `d:/file.env`)
2. Выполнить команду для запуска
```
docker run --name bookstor-ts --rm -it -v ~/data:/usr/src/app/data -v ~/public:/usr/src/app/public --mount type=bind,source=d:/file.env,target=/usr/src/app/file.env,readonly  --env=CONFIG_FILE=./file.env -p 3000:3000 --privileged makevg/bookstor-ts npm start 
```


### Запуск с использованием файлового хранилища локально без докера
Для запуска сервера BookStor локально без использования контейнеров необходимо выполнить команду:
- для режима отладки `npm run watch`
- для основного режима `npm run build` и потом `npm run start` 


## Задание
[https://github.com/netology-code/ndtnf-homeworks/tree/master/010-nestjs-validation](https://github.com/netology-code/ndtnf-homeworks/tree/master/010-nestjs-validation)
