var knox = require('knox');
var request = require('request');
var q = require('q');
var its = require('its');

function createAPI(options){
  var client = knox.createClient(options);

  var api = {};

  api.sync = require('./lib/sync').bind(null, client);
  api.copy = require('./lib/copy').bind(null, client);

  api.deleteFile = require('./lib/deleteFile').bind(null, client);
  api.deleteMultiple = require('./lib/deleteMultiple').bind(null, client);
  api.deleteDirectory = require('./lib/deleteDirectory').bind(null, client);
  api.diff = require('./lib/diff').bind(null, client);
  api.head = require('./lib/head').bind(null, client);
  api.list = require('./lib/list').bind(null, client);
  api.putFile = require('./lib/putFile').bind(null, client);
  api.putStream = require('./lib/putStream').bind(null, client);
  api.updateAcl = require('./lib/updateAcl').bind(null, client);

  return api;
}

module.exports = function createApi(bucket, options){
  its.string(bucket);

  var deferred = q.defer();

  if(options.awsIAMRole) {
    var credUrl = 'http://169.254.169.254/latest/meta-data/iam/security-credentials/' + options.awsIAMRole;
    request(credUrl, function(error, response, body){
      if(error || response.statusCode !== 200){
        return deferred.reject(error || response);
      }

      var creds = JSON.parse(body);
      var accessKeyId = creds.AccessKeyId;
      var secretAccessKey = creds.SecretAccessKey;
      var token = creds.Token;

      var api = createAPI({
        key: accessKeyId,
        secret: secretAccessKey,
        bucket: bucket,
        sessionToken: token
      });

      deferred.resolve(api);
    });
  } else {
    its.string(options.awsAccessKeyId);
    its.string(options.awsSecretAccessKey);

    var api = createAPI(bucket, options.awsAccessKeyId, options.awsSecretAccessKey);
    deferred.resolve(api);
  }

  return deferred.promise;
};
