var q = require('q'),
  fs = require('fs'),
  glob = require('glob'),
  path = require('path');

var list = require('./list');

module.exports = function diff(client, directory, prefix) {
  var deferred = q.defer();
  var searchGlob = path.join(directory, '**/*');
  glob(searchGlob, function(err, files){
    if(err){
      deferred.reject(err);
      return;
    }

    var localFiles = files.filter(function(filePath){
      var stat = fs.statSync(filePath);
      return stat.isFile();
    }).map(function(file){
      return path.relative(directory, file);
    });

    list(client, prefix).then(function(data){
      var remoteFiles = data.Contents;
      var removedFiles = [];
      var remoteFileMap = {};
      remoteFiles.forEach(function(remoteFile){
          var fileName = path.relative(prefix, remoteFile.Key);
          remoteFileMap[fileName] = remoteFile;
      });

      var remoteFileNames = Object.keys(remoteFileMap);
      var existingFiles = [];
      var filesToRemove = remoteFileNames.filter(function(remoteFile){
        if(localFiles.indexOf(remoteFile) === -1){
          return true;
        } else {
          existingFiles.push(remoteFile);
          return false;
        }
      });

      var newFiles = localFiles.filter(function(newFile){
        return existingFiles.indexOf(newFile) === -1;
      });

      deferred.resolve({
        new: newFiles,
        existing: existingFiles,
        removed: filesToRemove
      });
    }).catch(function(e){
      deferred.reject(e);
    });
  });

  return deferred.promise;
};
