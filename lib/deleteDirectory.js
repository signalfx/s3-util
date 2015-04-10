var q = require('q');
var list = require('./list');

module.exports = function deletePrefix(client, prefix){
  return list(client, prefix).then(function(data){
    var deferred = q.defer();

    var fileKeys = data.Contents.map(function(file){
      return file.Key;
    });

    client.deleteMultiple(fileKeys, function(err, res){
      if(err) return deferred.reject(err);
      deferred.resolve(data.Contents);
    });

    return deferred.promise;
  });
};
