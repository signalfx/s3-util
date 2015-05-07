var q = require('q');

module.exports = function deleteMultiple(client, resourcePaths){
  var deferred = q.defer();
  var headers = {};
  if(client.options.sessionToken){
    headers['x-amz-security-token'] = client.options.sessionToken;
  }

  client.deleteMultiple(resourcePaths, headers, function(err, res){
   if(err) return deferred.reject(err);
   deferred.resolve();
  });

  return deferred.promise;
};
