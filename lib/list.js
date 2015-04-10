var q = require('q');

module.exports = function list(client, prefix){
  var deferred = q.defer();

  client.list({ prefix: prefix }, function(err, data){
    if(err) return deferred.reject(err);
    deferred.resolve(data);
  });

  return deferred.promise;
};
