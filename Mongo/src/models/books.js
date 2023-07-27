import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookSchema = new Schema({
  _id: String,
  title: String,
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
  fileBook: String
})


export default model('books', bookSchema);
