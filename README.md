# PI Lapse

Simple timelapse application for rasperry pi camera that uploads to an s3 bucket and allows for configurable image size and time intervals.

## Prerequisites

- RaspberryPi
- RaspberryPi Camera
- Raspbian OS (have not tested on noobs)
- nodejs


## Installation

- Clone this repo to `/opt/pilapse` (you can put it elsewhere but it will need to stay wherever you put it)
- Edit the `credentials.json` file to add your AWS key, secret, and region.
- Edit the `config.js` file to set your S3 bucket, image size, and capture frequency
- Run `make`
- Run `make install` (if you want to have it installed as a service and run at boot)


