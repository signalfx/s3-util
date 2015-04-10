var q = require('q');

module.exports = function deleteMultiple(client, resourcePaths){
  var deferred = q.defer();
  
  client.deleteMultiple(resourcePaths, function(err, res){
   if(err) return deferred.reject(err);
   deferred.resolve();
  });

  return deferred.promise;
};
