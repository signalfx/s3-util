var list = require('./list');

module.exports = function updateAcl(client, prefix, acl){
  return list(client, prefix)
    .then(function(files){
      var promises = files.map(function(file){
        var deferred = q.defer();

        var filePath = '/' + file.Key;
        client.request('PUT', filePath + '?acl', { 'x-amz-acl': acl }).on('response', function(res){
          if(res.statusCode === 200) deferred.resolve();
          else deferred.reject(res);
        }).on('error', function(err){
          deferred.reject(err);
        }).end();

        return deferred.promise;
      });

      return q.all(promises);
    });
};
