import fs from 'fs'
import os from 'os'
import multer from 'multer'
import CONFIG from '../config.js'

/////////////////////////////////////////////////

const UPLOAD_PATH = process.env.DATA_PATH ||  CONFIG.data_path || 'public/fileBook'

/////////////////////////////////////////////////
// Проверка на существование пути и создание его
if (!fs.existsSync(UPLOAD_PATH)){
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

/////////////////////////////////////////////////

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (!fs.existsSync(UPLOAD_PATH)) {
            fs.mkdirSync(UPLOAD_PATH);
        }
        cb(null, UPLOAD_PATH)
    },
    filename(req, file, cb) {
        const date = Date.now()
        const { id } = req.params || ''
        if (id)
           cb(null, `${id}_${date}.${file.originalname.split('.').pop()}`)
        else
            cb(null, `${date}.${file.originalname.split('.').pop()}`)
            // throw Error('No book ID')
    }
})



// экспорт по умолчанию
export default multer({storage})
