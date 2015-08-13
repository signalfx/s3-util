var q = require('q');

module.exports = function list(client, prefix){
  var deferred = q.defer();

  var headers = {};
  if(client.options.sessionToken){
    headers['x-amz-security-token'] = client.options.sessionToken;
  }

  client.list({ prefix: prefix }, headers, function(err, data){
    if(err) return deferred.reject(err);
    deferred.resolve(data.Content);
  });

  return deferred.promise;
};
