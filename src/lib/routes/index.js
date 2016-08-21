'use strict';

import { spawn } from 'child_process';
import StreamSplitter from 'stream-splitter';

exports.serveEndpoints = (app, staticFolder) => {
  app.get('/start_streaming', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('start_streaming');
    startStreaming();
  });

  app.get('/stop_streaming', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('stop_streaming');
    stopStreaming();
  });

  app.get('/take_photo', (req, res) => {
    takePhoto(res);
  });

  // Load the single view
  // NB: This needs to be the last route added
  app.get('*', (req, res) => {
    res.sendFile(req.path, { root: staticFolder });
  });
};

function startStreaming() {
  setTimeout(() => {
    const child = spawn('scripts/start_streaming.sh');
    child.on('error', (error) => {
      if (error && error.code !== 255) {
        console.log(error.stack);
        console.log('start_streaming.sh error code: ' + error.code);
        console.log('start_streaming.sh signal received: ' + error.signal);
      }
    });
    child.on('exit', (code, signal) => {
      if (code !== 255) {
        console.log('start_streaming.sh exit code: ' + code);
        console.log('start_streaming.sh signal received: ' + signal);
      }
    });
  }, 0);
}

function stopStreaming() {
  const child = spawn('scripts/stop_streaming.sh');
  child.on('error', (error) => {
    if (error && error.code !== 255) {
      console.log(error.stack);
      console.log('stop_streaming.sh error code: ' + error.code);
      console.log('stop_streaming.sh signal received: ' + error.signal);
    }
  });
  child.on('exit', (code, signal) => {
    if (code !== 255) {
      console.log('stop_streaming.sh exit code: ' + code);
      console.log('stop_streaming.sh signal received: ' + signal);
    }
  });
}

function takePhoto(res) {
  stopStreaming();
  const child = spawn('scripts/take_photo.sh');
  child.on('error', (error) => {
    if (error && error.code !== 255) {
      console.log(error.stack);
      console.log('take_photo.sh error code: ' + error.code);
      console.log('take_photo.sh signal received: ' + error.signal);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('take_photo');
    }
  });
  child.on('exit', (code, signal) => {
    startStreaming();
  });
  console.log('take_photo.sh started');
  var splitter = child.stdout.pipe(StreamSplitter('\n'));
  splitter.encoding = 'utf8';

  splitter.on('token', (token) => {
    console.log('take_photo.sh stdout ' + token);
    res.send(token);
  });
  splitter.on('done', () => {
    console.log('take_photo.sh finished');
  });
}
