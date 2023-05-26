import fs from 'fs'
import multer from 'multer'

/////////////////////////////////////////////////

const UPLOAD_PATH = process.env.DATA_PATH || 'public/fileBook'

/////////////////////////////////////////////////
// Проверка на существование пути и создание его
if (!fs.existsSync(UPLOAD_PATH)){
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

/////////////////////////////////////////////////


const storage = multer.diskStorage({
    destination(req, file, cb) {
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
