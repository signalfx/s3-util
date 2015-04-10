var q = require('q');

module.exports = function head(client, resourcePath){
  var deferred = q.defer();

  client.head(resourcePath).on('response', function(res){
    deferred.resolve(res);
  }).end();

  return deferred.promise;
};
