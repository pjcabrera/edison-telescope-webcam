#!/bin/sh

~/bin/ffmpeg/ffmpeg -s 1280x720 -f video4linux2 -i /dev/video0 -f mpeg1video \
-b:v 1200k -r 30 http://127.0.0.1:8082
