#!/bin/sh

regex="[^/]*$"
fn=$(mktemp -u | grep -o "$regex")
~/bin/ffmpeg/ffmpeg -f video4linux2 -i /dev/video0 \
-s 1280x720 -r 30 -t 10 \
-f mp4 -c:v libx264 -movflags +faststart -crf 18 -preset fast -profile:v baseline -level 3.0 -pix_fmt yuv420p -r 30 \
public/videos/${fn}.mp4 >/dev/null 2>&1
echo videos/${fn}.mp4
