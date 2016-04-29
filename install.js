var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  fs = require('fs'),
  crypto = require('crypto'),
  util = require('util');

console.log('Running install script.');

//Math.random().toString(36).substr(2, 12);
var password = 'admin';

var insertUser = function(db, callback) {
  db.collection('users').insertOne({
    '_id': 'admin',
    'auth': {
      'username': 'admin',
      'password': crypto.createHash('md5').update(password).digest("hex")
    },
    'type': 'admin',
    'status': 'active'
  }, function(err, result) {
    console.log("User Inserted into DB");
    callback(result);
  });
};

MongoClient.connect(util.format('mongodb://%s:%s/smixtr', process.env.MONGODB  || '127.0.0.1', 27017), function(err, db) {
  console.log(process.env.MONGODB);
  insertUser(db, function() {
    db.close();
    console.log('Installation finished.');
    console.log('Login with username: admin and password: ' + password);
  });
});
