import fs from 'fs'
import path from 'path'
import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express';
import CONFIG from '../config';

/////////////////////////////////////////////////

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

/////////////////////////////////////////////////

const UPLOAD_PATH = process.env.UPLOAD_PATH || CONFIG.UPLOAD_PATH || 'public/fileBook'

/////////////////////////////////////////////////
// Проверка на существование пути и создание его
if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
    fs.mkdirSync(UPLOAD_PATH + 'fileBooks', { recursive: true });
    fs.mkdirSync(UPLOAD_PATH + 'fileCovers', { recursive: true });
}

/////////////////////////////////////////////////

const storage = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb: DestinationCallback): void {
        if (file.fieldname === "fileBook") {
            // if uploading fileBook
            cb(null, UPLOAD_PATH + 'fileBooks');
        } else if (file.fieldname === "fileCover") {
            // if uploading fileCover
            cb(null, UPLOAD_PATH + 'fileCovers');
        } else {
            // if uploading smth else
            cb(null, UPLOAD_PATH);
        }
    },
    filename(req: Request, file: Express.Multer.File, cb: FileNameCallback): void {
        // naming file
        const date = Date.now()
        const { id } = req.params || ''
        if (id)
            cb(null, `${id}_${date}.${path.extname(file.originalname)}`)
        else
            cb(null, `${date}.${path.extname(file.originalname)}`)
    }
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.fieldname === "fileBook") {
        // if uploading fileBook
        if (
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'image/vnd.djvu' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            // check file type to be pdf, doc, docx or djvu
            cb(null, true);
        } else {
            // else fails
            cb(null, false);
        }
    } else if (file.fieldname === "fileCover") {
        // if uploading fileCover
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'application/pdf'
        ) { // check file type to be png, jpeg, jpg or pdf
            cb(null, true);
        } else {
            // if uploading smth else
            cb(null, false);
        }
    } else {
        // else uploading image
        // TODO: accept all files - need filter??
        cb(null, true);
    }
}

/////////////////////////////////////////////////

// экспорт по умолчанию
export const fileMulter = multer({
    storage,
    fileFilter
}).fields(
    [{
        name: 'fileBook',
        maxCount: 1
    }, {
        name: 'fileCover',
        maxCount: 1
    }]
)
