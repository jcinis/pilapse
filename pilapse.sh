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

case "$1" in
  start)
    echo "Starting pilapse"
	/usr/bin/nodejs /opt/pilapse/pilapse.js
    ;;
  stop)
    echo "Stopping pilapse"
	PID=`cat /opt/pilapse/pilapse.pid`
    kill $PID
	;;
  *)
    echo "Usage: /etc/init.d/pilapse {start|stop}"
    exit 1
    ;;
esac

exit 0
