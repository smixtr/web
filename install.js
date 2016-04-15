var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  fs = require('fs'),
  crypto = require('crypto'),
  util = require('util');

console.log('Running install script.');

var password = Math.random().toString(36).substr(2, 12);

var insertUser = function(db, callback) {
  db.collection('users').insertOne({
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

MongoClient.connect(util.format('mongodb://%s:%s/smixtr', process.env.MONGODB, 27017), function(err, db) {
  insertUser(db, function() {
    db.close();
    console.log('Installation finished.');
    console.log('Login with username: admin and password: ' + password);
  });
});
