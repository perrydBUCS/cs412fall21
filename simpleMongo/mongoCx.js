const mongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017';

let _db = null; //connection

module.exports = {

    getDB: async dbName => {
        //if we have a conx, just return it
        if (_db) { return _db; }
        else {
            let _client = await mongoClient.connect(mongoURL); //connect to db
            _db = _client.db(dbName);
            return _db
        }
    }
}
