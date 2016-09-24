#!/bin/sh

~/bin/ffmpeg/ffmpeg -f video4linux2 -i /dev/video0 \
-s 640x350 -r 30 \
-f mpeg1video http://127.0.0.1:8082 >/dev/null 2>&1
