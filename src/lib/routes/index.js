// const childProcess = require('child_process');

exports.serveIndex = (app, staticFolder) => {
  /*
  app.get('/start_streaming', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('start_streaming');
    // start ffmpeg streaming from node
    setTimeout(() => {
      childProcess.exec('scripts/start_ffmpeg_streaming.sh', (error, stdout, stderr) => {
        if (error) {
          console.log(error.stack);
          console.log('start_ffmpeg_streaming.sh error code: ' + error.code);
          console.log('start_ffmpeg_streaming.sh signal received: ' + error.signal);
        }
      });
    }, 0);
  });

  app.get('/stop_streaming', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('stop_streaming');
    // stop ffmpeg streaming from node
    childProcess.exec('scripts/stop_ffmpeg.sh', (error, stdout, stderr) => {
      if (error) {
        console.log(error.stack);
        console.log('stop_ffmpeg.sh error code: ' + error.code);
        console.log('stop_ffmpeg.sh signal received: ' + error.signal);
      }
    });
  });
*/
  // Load the single view
  // NB: This needs to be the last route added
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: staticFolder });
  });
};
