const fs = require('fs');
const path = require('path');
const config = require('./config');
const moment = require('moment');
const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const AWS = require('aws-sdk');
AWS.config.loadFromPath(path.join(__dirname,'aws-creds.json'));
const s3 = new AWS.S3();

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

var captureProc = null;
function takePicture() {
  return new Promise(function(resolve){

    if(captureProc != null) {
      captureProc.kill();
      captureProc = null;
	  }

    var date = moment.utc();
    var datestr = date.format('YYYYMMDDHHmmss');
    var filename = datestr+".jpg";
    var filepath = path.join(config.capture_dir, filename);
    var keyname = date.format("YYYY/MM/DD/") + filename;
    var args = ["-awb", "auto", "-ex", "auto", "-w", config.capture_width, "-h", config.capture_height, "-vf", "-o", filepath];

    console.info(keyname + "\tcapture started")
    captureProc = spawn('raspistill', args);
    console.info(keyname + "\tcapture complete")

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
      if(err) throw err;

      var s3bucket = new AWS.S3({params: {Bucket: config.aws_s3_bucket }});
      var params = {
        Key: picture.keyname,
        Body: data
      };

      console.info(picture.keyname + "\tupload started");
      s3bucket.upload(params, function (err, data) {
        if (err) {
        	reject(err);
        } else {
          console.info(picture.keyname + "\tupload complete");
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
      console.info(picture.keyname + "\tdeleted local file\t" + picture.filepath);
      resolve(picture);
    });
  });
}

function capture(){
  takePicture()
    .then(uploadPicture)
    .then(deleteFile)
    .then(function(picture){
      console.info(picture.keyname + "\turl created\t" + picture.getUrl(60));
    });
}

var interval;
var pid_path = path.join(__dirname,'pilapse.pid');

function start(){
  fs.readFile(pid_path, function(err, data){
    if (!err) {

      throw new Error('Process '+ data +' already running from '+pid_path);

    } else {

      var pid = String(process.pid);
      fs.writeFile(pid_path, pid, function(err) {
        if (err) throw err;
      });

      console.info("process\tstarting timelapse\t" + config.capture_frequency + " seconds");

      capture(); // take picture on start
      interval = setInterval(function(){
        capture();
      }, config.capture_frequency * 1000)

    }
  });
}

function stop(){

  fs.unlink(pid_path, function(err){
    if (err) throw err;
  });

  if(interval) clearInterval(interval);
  console.info("process\thalting timelapse");
}


// MAIN :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

start();
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
