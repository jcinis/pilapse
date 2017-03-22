const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const path = require('path');
const config = require('./config');
const moment = require('moment');
const spawn = require('child_process').spawn;

var captureProc;

function takePicture() {
  if(captureProc) captureProc.kill();

  var date = moment.utc().format('YYYYMMDDHHmmss');
  var filepath = path.join(config.capture_dir, date+".jpg");

  var args = ["-awb", "auto", "-ex", "auto", "-w", "1280", "-h", "1024", "-vf", "-o", "./capture/"+date+".jpg"];
  captureProc = spawn('raspistill', args);

  captureProc.on('close', (code) => {
      console.log(filepath,code);
  });
}


takePicture();


/*
var filepath = "./test.jpg";
var keyname  = path.basename(filepath);

fs.readFile(filepath, function(err, data) {

	if(err) throw err;
    console.log(data);

    var s3bucket = new AWS.S3({params: {Bucket: aws_s3_bucket }});
    var params = {
        Key: keyname,
        Body: data
    };
    s3bucket.upload(params, function (err, data) {
        if (err) {
            console.log('ERROR MSG: ', err);
        } else {
            console.log('Successfully uploaded '+keyname);
            var params = {Bucket: aws_s3_bucket, Key: keyname, Expires: 60};
            var url = s3.getSignedUrl('getObject', params);
            console.log(url);
        }
    });
});
*/
