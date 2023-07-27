import mongoose from 'mongoose';
import {sha256wSaltSync, sha256wSalt} from '../hash.js'

const { Schema, model } = mongoose;

const userSchema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    salt: String
})

userSchema.methods.checkPasswords = function (password, cb) {
    sha256wSalt(password, this.salt).then((res) => {
        if (res === this.password)
            cb(true)
        else
            cb(false)
    })
}


userSchema.pre('save', function (next) {
    //const { salt, hash } = sha256wSaltSync(this.password)
    var innerObject = this
    sha256wSalt(this.password, 10, ({salt, hash}) => {
        innerObject.salt = salt
        innerObject.password = hash
        next();
    })
    
})



export default model('users', userSchema);
