#!/bin/sh

ffmpeg -s 1280x720 -f avfoundation -i "default" -f mpeg1video \
-b:v 1200k -r 30 -mbd rd -trellis 2 -cmp 2 -subcmp 2 http://127.0.0.1:8082
