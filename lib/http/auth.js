var basicAuth = require('basic-auth'),
  async = require('async'),
  vendors = require('../../vendors'),
  crypto = require("crypto");

module.exports = function(req, res, next) {
  var login = basicAuth(req);

  if (login && login.name) {
    login.name = login.name.toLowerCase();
  }

  var user;
  var pass;

  if (login) {
    user = login.name;
    pass = login.pass;
  }

  async.waterfall([

    function(callback) {
      if (!user || !pass || user.trim().length === 0 || pass.trim().length === 0) {
        return callback('no authentication data received');
      }

      var cursor = vendors.mongo.collection('users').findOne({
        'auth.username': user,
        'auth.password': crypto.createHash('md5').update(pass).digest('hex')
      }, function(err, doc) {
        if (!err && doc !== null) {
          if (doc.status === 'active') {
            delete doc.auth.password;
            callback(undefined, doc);
          } else {
            callback('contact administrator');
          }
        } else {
          return callback('invalid authentication');
        }
      });
    }
  ], function(err, user) {
    if (err || !user) {
      return res.status(401).json({
        'result': 'nok',
        'message': 'access denied'
      });
    }

    req.user = user;
    req.user.ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    next();
  });
};
