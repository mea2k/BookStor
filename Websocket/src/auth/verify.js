import { sha256Sync } from '../hash.js'
import users from '../models/user.js'
import { userStorage } from '../users/userStorage.js'


// const verifyDB = (login, password, cb) => {
//     users.findOne({ login }).then(async (user) => {
//         // не найден пользователь
//         if (!user)
//             return cb(null, false, { message: "Неверное имя пользователя" })
//         // пароли не совпадаюь
//         const passw = await sha256Sync(password, user.salt)
//         if (passw !== user.password)
//             return cb(null, false, { message: "Неверный пароль" })
//         // все ОК
//         else
//             return cb(null, user)
//     })
// }


const verify = async (login, password, cb) => {
    try {
        const user = await userStorage.getByLogin(login)
        // не найден пользователь
        if (!user)
            return cb(null, false, { message: "Неверное имя пользователя" })
        // пароли не совпадаюь
        const passw = await sha256Sync(password, user.salt)
        if (passw !== user.password)
            return cb(null, false, { message: "Неверный пароль" })
        // все ОК
        else
            return cb(null, user)
    } catch (e) {
        // если какая-то ошибка
        return cb(e, false, { message: "Ошибка аутентификации!" })
    }
}


// function verify(login, password, cb) {
//     switch (CONFIG.STORAGE_TYPE) {
//         case "file":
//             return verifyFile(login, password, cb)
//         case "mongo":
//             return verifyDB(login, password, cb)
//     }
// }


export default verify