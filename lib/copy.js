var q = require('q');

var list = require('./list');

module.exports = function copy(client, fromPrefix, toPrefix){
  return list(client, fromPrefix).then(function(files){
    var promises = files.Contents.map(function(file){
      var deferred = q.defer();

      var file = file.Key;

      var replaceRegex = new RegExp('^' + fromPrefix);
      var sourcePath = '/' + file;
      var destinationPath = '/' + file.replace(replaceRegex, toPrefix);

      client.copyFile(sourcePath, destinationPath, function(err, res){
        if(err) return deferred.reject(err);
        deferred.resolve(res);
      });
      return deferred.promise;
    });

    return q.all(promises);
  });
};
