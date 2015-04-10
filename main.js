var knox = require('knox');
var its = require('its');

module.exports = function createApi(awsAccessKeyId, awsSecretAccessKey, bucketName){
  its.string(awsAccessKeyId);
  its.string(awsSecretAccessKey);
  its.string(bucketName);

  var client = knox.createClient({
    key: awsAccessKeyId,
    secret: awsSecretAccessKey,
    bucket: bucketName
  });

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
};
