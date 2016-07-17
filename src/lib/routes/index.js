'use strict';

import childProcess from 'child_process';

exports.serveEndpoints = (app, staticFolder) => {
  app.get('/is_video_streaming', (req, res) => {
    res.send(app.isVideoStreaming ? 'YES' : 'NO');
  });

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

  // Load the single view
  // NB: This needs to be the last route added
  app.get('*', (req, res) => {
    res.sendFile(req.path, { root: staticFolder });
  });
};

function startStreaming() {
  setTimeout(() => {
    childProcess.exec('scripts/start_streaming.sh', (error, stdout, stderr) => {
      if (error && error.code !== 255) {
        console.log(error.stack);
        console.log('start_streaming.sh error code: ' + error.code);
        console.log('start_streaming.sh signal received: ' + error.signal);
      }
    });
  }, 0);
}

function stopStreaming() {
  childProcess.exec('scripts/stop_streaming.sh', (error, stdout, stderr) => {
    if (error && error.code !== 255) {
      console.log(error.stack);
      console.log('stop_streaming.sh error code: ' + error.code);
      console.log('stop_streaming.sh signal received: ' + error.signal);
    }
  });
}
