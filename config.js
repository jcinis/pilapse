const path = require('path');

module.exports = {
  "aws_access_key_id":"",
  "aws_secret_access_key":"",
  "aws_s3_bucket":"",
  "capture_dir": path.join(__dirname,'capture'),
  "capture_frequency":60, // in seconds
  "capture_width":1280,   // 1280 or 3280
  "capture_height":1024   // 1024 or 2464,
};
