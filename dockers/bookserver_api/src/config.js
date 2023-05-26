import fs from 'fs'

let CONFIG = {}
try {
    CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8')) || {};
} catch (e) {
    console.log("Error reading file 'config.json'")
    CONFIG = {}
}

export default CONFIG;