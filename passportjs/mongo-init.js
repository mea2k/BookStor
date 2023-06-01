
var db = connect("mongodb://localhost:27017/admin");
db.getSiblingDB("admin")
db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);

db.createUser(
    {
        user: process.env.MONGO_INITDB_USERNAME,
        pwd:  process.env.MONGO_INITDB_PASSWORD,
        roles: [ { 
            role: "readWrite", 
            db: process.env.MONGO_INITDB_DATABASE
        } ],
        passwordDigestor: "server",
    }
)

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE); // we can not use "use" statement here to switch db

db.createCollection(process.env.MONGO_INITDB_DATABASE_COLLECTION);

