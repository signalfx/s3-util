#s3-util

> High-level utility for dealing with [S3](http://aws.amazon.com/s3/).

Bower to S3 synchronizes an S3 bucket + prefix with the contents of a given
bower package. This means that any files which are not in the bower package
will be removed from the destination prefix.

## Usage via the Command Line
```sh
# Install as a global executable
$ npm install -g s3-util
$ s3-util -h # print help
```

## Usage via the API
```sh
# Install as a local package
$ npm install --save s3-util
```

```javascript
// Inside a JavaScript file...

var s3Util = require('s3-util');

// Construct the client
var client = s3Util(
    bucket: 'my-s3-bucket',
    awsAccessKeyId: 'abcdef',
    awsSecretAccessKey: '123456'
);

// Synchronizes a local file, directory, or glob pattern with an s3 destination
// if a directory is passed in, all files in the S3 destination which are not
// present locally will be deleted.
client.sync(localSource, s3DestinationPath, uploadOptions);

client.copy(s3SourceDirectory, s3DestinationDirectory);

client.diff(localDirectoryPath, s3DirectoryPath);

client.head(s3FilePath);
client.list(s3DirectoryPath);
client.updateAcl(s3Path, aclString);

client.putStream(stream, s3DestinationPath, uploadOptions);
client.putFile(localFilePath, s3DestinationPath, uploadOptions);

client.deleteFile(s3FilePath);
client.deleteMultiple([s3FilePath1, s3FilePath2]);
client.deleteDirectory(s3DirectoryPath);

```
