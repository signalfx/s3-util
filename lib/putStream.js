var q = require('q'),
  mime = require('mime'),
  zlib = require('zlib'),
  pauseStream = require('pause-stream');

var TO_GZIP = [
  'text/html',
  'text/plain',
  'text/xml',
  'text/css',
  'text/javascript',
  'application/javascript'
];

/*
  @param stream the data stream to put in destination
  @param destinationPath the path to where to put the stream
  @param an object or function(stream, destinationPath) which returns an object
    containing the optional parameters (such as headers) for this put request.
*/
module.exports = function putStream(client, stream, destinationPath, options){
  var deferred = q.defer();

  options = options || {};

  if(typeof options === 'function') {
    options = options(stream, destinationPath);
  }

  var additionalHeaders = options.headers || {};

  var headers = {};

  Object.keys(additionalHeaders).forEach(function(headerName){
    headers[headerName] = additionalHeaders[headerName];
  });

  var mimeType = mime.lookup(destinationPath);
  var shouldGzip = TO_GZIP.indexOf(mimeType) !== -1;
  if(shouldGzip){
    stream = stream.pipe(zlib.createGzip());
    headers['Content-Encoding'] = 'gzip';
  }

  if(headers['Content-Type'] === undefined){
    headers['Content-Type'] = mimeType;
  }

  var contentLength = 0;
  var streamBuffer = pauseStream();
  streamBuffer.pause();

  stream.on('data', function(data){
    contentLength += data.length;
    streamBuffer.write(data);
  });

  stream.on('end', function(){
    headers['Content-Length'] = contentLength;

    if(client.options.sessionToken){
      headers['x-amz-security-token'] = client.options.sessionToken;
    }

    client.putStream(streamBuffer, destinationPath, headers, function(err, res){
      if(err) {
        deferred.reject(err);
      }

      var chunks = [];
      res.on('data', function(chunk){
        chunks.push(chunk);
      });

      res.on('end', function(){
        if(res.statusCode >= 300){
          var responseText = chunks.map(function(chunk){
            return chunk.toString();
          }).join();

          deferred.reject(new Error(destinationPath + ' returned status code of ' + res.statusCode + '.\n' + responseText));
          res.resume();
        } else {
          deferred.resolve();
          res.resume();
        }
      });
    });

    streamBuffer.resume();
  });

  stream.on('error', function(err){
    deferred.reject(err);
  });

  return deferred.promise;
};
