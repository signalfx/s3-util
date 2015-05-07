var list = require('./list');

module.exports = function updateAcl(client, prefix, acl){
  return list(client, prefix)
    .then(function(files){
      var promises = files.map(function(file){
        var deferred = q.defer();

        var filePath = '/' + file.Key;

        var headers = {
          'x-amz-acl': acl
        };
        if(client.options.sessionToken){
          headers['x-amz-security-token'] = client.options.sessionToken;
        }

        client.request('PUT', filePath + '?acl', headers).on('response', function(res){
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
