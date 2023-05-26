
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




// db = db.getSiblingDB('admin');
// // move to the admin db - always created in Mongo
// db.auth(_getEnv("MONGO_INITDB_ROOT_USERNAME"), _getEnv("MONGO_INITDB_ROOT_PASSWORD"));
// // log as root admin if you decided to authenticate in your docker-compose file...
// db = db.getSiblingDB(_getEnv("MONGO_INITDB_DATABASE"));
// // create and move to your new database
// db.createUser({
// 'user': "dbUser",
// 'pwd': "dbPwd",
// 'roles': [{
//     'role': 'dbOwner',
//     'db': 'DB_test'}]});
// // user created
// add new collection

// db.createUser(
//     {
//         user: _getEnv("MONGO_INITDB_ROOT_USERNAME"),
//         pwd:  _getEnv("MONGO_INITDB_ROOT_PASSWORD"),
//         roles: [
//             {
//                 role: "dbOwner",
//                 db: "bookstore"
//             }
//         ]
//     }
// );