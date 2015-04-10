var putStream = require('./putStream'),
  fs = require('fs');

module.exports = function putFile(client, filePath, destinationPath, options){
  var stream = fs.createReadStream(filePath);
  return putStream(client, stream, destinationPath, options);
};
