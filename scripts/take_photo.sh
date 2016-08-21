#!/bin/sh

regex="[^/]*$"
fn=$(mktemp -u | grep -o "$regex")
fswebcam -r 1280x720 -S 5 --flip h --png --info "Edison Telescope Webcam" --save \
public/photos/${fn}.png >/dev/null 2>&1
echo photos/${fn}.png
