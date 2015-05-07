var q = require('q');

module.exports = function head(client, resourcePath){
  var deferred = q.defer();

  var headers = {};
  if(client.options.sessionToken){
    headers['x-amz-security-token'] = client.options.sessionToken;
  }
  
  client.head(resourcePath, headers).on('response', function(res){
    deferred.resolve(res);
  }).end();

  return deferred.promise;
};
