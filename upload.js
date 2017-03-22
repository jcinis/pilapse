const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const path = require('path');

var aws_s3_bucket = "809f8c7e-cc23-484a-a3b0-e028084e4e4e";

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
