import { IConfig, StorageTypes } from "./interfaces/config"


/////////////////////////////////////////////////
// КОНСТАНТЫ ПО УМОЛЧАНИЮ
/////////////////////////////////////////////////
let CONFIG: IConfig = {
    // ТИП ХРАНИЛИЩА {"file", "mongo"}
    STORAGE_TYPE: StorageTypes.file,

    // ПОРТ приложения
    PORT: 3000,
    
    // ПУТИ ДЛЯ ХРАНЕНИЯ ДАННЫХ
    // И ЗАГРУЗКИ ФАЙЛОВ
    DATA_PATH: "data/",
    UPLOAD_PATH: "public/upload/",
   
    // КОНСТАНТЫ ДЛЯ РАБОТЫ С БД MONGO
    // строка подключения
    MONGO_URL: "mongodb://localhost:27017/",
    // имя БД
    MONGO_DATABASE: "books",
    // пользователь и пароль для работы с БД
    MONGO_USERNAME: "user",
    MONGO_PASSWORD: "user",

    // КОНСТАНТЫ ДЛЯ РАБОТЫ С ФАЙЛАМИ
    BOOKS_FILE: "books.json",
    USERS_FILE: "users.json" 
}


/////////////////////////////////////////////////
// ЗАГРУЗКА ДАННЫХ ИЗ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ PROCESS.ENV
/////////////////////////////////////////////////
CONFIG = {
    ...CONFIG,
    ...process.env
}


/////////////////////////////////////////////////
/////////////////////////////////////////////////

export default CONFIG;