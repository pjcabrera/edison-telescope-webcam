const JSMPEG = window.jsmpeg;

window.streamPlayer;

var streamClientSocket;
var streamConnectInterval;

function setupStreaming() {
  // Show loading notice
  const canvas = document.getElementById('canvas-video');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#333';
  ctx.fillText('Too many connections, hold on ...', canvas.width / 2 - 70, canvas.height / 3);

  streamConnectInterval = setInterval(() => {
    // sometimes the timer keeps firing after the socket opens
    if (window.streamPlayer) {
      clearInterval(streamConnectInterval);
      return;
    }

    streamClientSocket = new window.WebSocket('ws://' + document.domain + ':8084');
    streamClientSocket.onclose = (event) => {
      streamClientSocket = undefined;
    };
    streamClientSocket.onopen = (event) => {
      clearInterval(streamConnectInterval);
      // Start the player
      window.streamPlayer = new JSMPEG(streamClientSocket, { canvas: canvas });
      console.log(window.streamPlayer);
    };
  }, 250);
}

window.setupStreaming = setupStreaming;
