#!/bin/sh

regex="[^/]*$"
fn=$(mktemp -u | grep -o "$regex")
fswebcam -r 1280x720 -S 5 --flip h --png --info "Edison Telescope Webcam" --save public/photos/${fn}.png
echo public/photos/${fn}.png
