import { Schema, Document, model } from 'mongoose';
import { IBook } from '../../interfaces/book';

const bookSchema = new Schema({
  _id: {
    type: Number,
    //unique: true,     // не надо, _id и так unique
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  authors: [String],
  fileCover: String,
  fileBook: String
})

export const BookModel = model<IBook & Document>('books', bookSchema);
