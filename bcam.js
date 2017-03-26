const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const path = require('path');
const config = require('./config');
const moment = require('moment');
const spawn = require('child_process').spawn;
const Promise = require('bluebird');

var captureProc;

function Picture(){
  this.filepath;
  this.keyname;
  this.url;

  this.getUrl = function(expires){
    expires = expires ? expires : 60;
	var params = {Bucket: config.aws_s3_bucket, Key: this.keyname, Expires: expires};
	this.url = s3.getSignedUrl('getObject', params);
  	return this.url;
  }
}

function takePicture() {
  return new Promise(function(resolve, reject){

  	if(captureProc) captureProc.kill();

	var date = moment.utc();
	var datestr = date.format('YYYYMMDDHHmmss');
    var filename = datestr+".jpg";
	var filepath = path.join(config.capture_dir, filename);
	var keyname = date.format("YYYY/MM/DD/") + filename;
	var args = ["-awb", "auto", "-ex", "auto", "-w", config.capture_width, "-h", config.capture_height, "-vf", "-o", filepath];
	captureProc = spawn('raspistill', args);

	var picture = new Picture();
    picture.filepath = filepath;
    picture.keyname = keyname;

	captureProc.on('close', function(code){
		resolve(picture);
	});
  });
}

function uploadPicture(picture) {
  return new Promise(function(resolve, reject){
	fs.readFile(picture.filepath, function(err, data) {
      if(err) reject(err);

      var s3bucket = new AWS.S3({params: {Bucket: config.aws_s3_bucket }});
      var params = {
        Key: picture.keyname,
        Body: data
      };

      s3bucket.upload(params, function (err, data) {
        if (err) {
        	reject(err);
		} else {

          console.info('uploaded: ' + picture.keyname);
          console.info('url created: ' + picture.getUrl(60));

          resolve(picture);
        }
      });
	});
  });
}

function deleteFile(picture) {
  return new Promise(function(resolve, reject){
    fs.unlink(picture.filepath, function(err){
      if (err) throw err;
      console.info('deleted: ' + picture.filepath);
      resolve(picture);
    });
  });
}

takePicture()
  .then(uploadPicture)
  .then(deleteFile)
  .then(console.log);

