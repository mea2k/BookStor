import fs from 'fs'
import os from 'os'
import multer from 'multer'

/////////////////////////////////////////////////

const UPLOAD_PATH = 'public/fileBook'

/////////////////////////////////////////////////


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename(req, file, cb) {
        const date = Date.now()
        const { id } = req.params
       if (id)
            cb(null, `${id}_${date}.${file.originalname.split('.').pop()}`)
        else
            throw Error('No book ID')
    }
})



// экспорт по умолчанию
export default multer({storage})
