var deleteMultiple = require('./deleteMultiple')
module.exports = function deleteFile(client, resourcePath){
  return deleteMultiple(client, [resourcePath])
    .then(function(result){
      // Since we used delete multiple, unpack the result
      return result && result[0];
    });
};
