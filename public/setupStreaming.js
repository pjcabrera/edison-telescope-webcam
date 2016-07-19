const JSMPEG = window.jsmpeg;

function setupStreaming() {
  // Show loading notice
  const canvas = document.getElementById('canvas-video');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#333';
  ctx.fillText('Too many connections, hold on ...', canvas.width / 2 - 70, canvas.height / 3);

  var interval = setInterval(() => {
    var client = new window.WebSocket('ws://' + document.domain + ':8084');
    client.onclose = (event) => {
      client = undefined;
    };
    client.onopen = (event) => {
      // Start the player
      var player = new JSMPEG(client, { canvas: canvas });
      console.log(player);
      clearInterval(interval);
    };
  }, 250);
}

window.setupStreaming = setupStreaming;
