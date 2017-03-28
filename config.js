const path = require('path');

module.exports = {
  "aws_s3_bucket":"809f8c7e-cc23-484a-a3b0-e028084e4e4e",
  "capture_dir": path.join(__dirname,'capture'),
  "capture_frequency":60*5, // in seconds
  "capture_width":1280,   // 1280 or 3280
  "capture_height":1024   // 1024 or 2464,
};
