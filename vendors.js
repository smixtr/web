var oauth = require('oauth'),
  MongoClient = require('mongodb').MongoClient,
  ig = require('instagram-node').instagram(),
  GitHubApi = require("github"),
  util = require('util');


MongoClient.connect(util.format('mongodb://%s:%s/smixtr', process.env.MONGODB || '127.0.0.1', 27017), function(err, db) {
  if (err) throw err;
  console.log('Connected to mongodb.');
  exports.mongo = db;
});
