#! /bin/sh

### BEGIN INIT INFO
# Provides:          pilapse
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Time-lapse camera application that posts to AWS S3
# Description:       Time-lapse camera service that utilizes the raspberry pi camera to take photos and post them to s3 on a given interval.
### END INIT INFO

PID=$(ps aux | grep pilapse.js | grep -v grep | awk '{print $2}')

case "$1" in
  start)
    if [ -z "$PID" ] ; then
    	echo "Starting pilapse"
	/usr/bin/nodejs /opt/pilapse/pilapse.js &
    else
        echo "Pilapse already running on process $PID"
    fi
    ;;
  stop)
    if [ -z "$PID" ] ; then
        echo "Pilapse is not running"
    else
        echo "Stopping pilapse"
        kill $PID
    fi
    ;;
  *)
    echo "Usage: /etc/init.d/pilapse {start|stop}"
    exit 1
    ;;
esac

exit 0

