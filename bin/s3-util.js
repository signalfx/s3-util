#!/usr/bin/env node

var program = require('commander');
var s3Util = require('../');

program
  .usage('[options] package bucket')
  .option('--globBase [directory name]', 'The base to use when handling glob patterns.', '')
  .option('--keyId [key id]', 'The AWS Access Key Id to use when uploading files.', process.env.AWS_ACCESS_KEY_ID)
  .option('--accessKey [access key]', 'The AWS Access Key to use when uploading files.', process.env.AWS_SECRET_ACCESS_KEY);

program.command('sync <s3Location> <source...>')
  .description('Synchronize an S3 location (<bucket>/<prefix>) with local files')
  .option('--acl [acl string]', 'The ACL string to use when uploading files (private by default)', 'private')
  .option('--cache [cache control]', 'The Cache-Control header to use for uploaded files (uncached by default)', 'no-cache')
  .action(function(s3Location, src, options){
    var divider = s3Location.indexOf('/');
    var bucket = divider !== -1 ? s3Location.substr(0, divider) : s3Location;
    var dest = divider !== -1 ? s3Location.substr(divider + 1) : '';

    if(src.length === 1) src = src[0];

    s3Util(bucket, {
      awsAccessKeyId: program.keyId,
      awsSecretAccessKey: program.accessKey
    }).then(function(client){
      client.sync(src, dest, {
        base: program.globBase,
        headers: {
          'x-amz-acl': options.acl,
          'Cache-Control': options.cache
        }
      }).catch(function(e){
        console.error(e.toString(), e.stack);
      });
    });
  });

program.command('delete <s3Location>')
.description('Delete all files within an S3 location')
.action(function(s3Location){
    var divider = s3Location.indexOf('/');
    var bucket = divider !== -1 ? s3Location.substr(0, divider) : s3Location;
    var dest = divider !== -1 ? s3Location.substr(divider + 1) : '';

    s3Util(bucket, {
      awsAccessKeyId: program.keyId,
      awsSecretAccessKey: program.accessKey
    }).then(function(client){
      client.deleteDirectory(dest).catch(function(e){
        console.error(e.toString(), e.stack);
      });
    });
  });

program.parse(process.argv);
