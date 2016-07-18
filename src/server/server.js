'use strict';

// modules
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import ws from 'ws';
import WebSocket from 'faye-websocket';

// configuration files
import configServer from '../lib/config/server';

// app parameters
var app = express();
app.set('port', configServer.httpPort);
app.use(express.static(configServer.staticFolder));
app.use(morgan('dev'));

app.isVideoStreaming = false;

// serve index
require('../lib/routes').serveEndpoints(app, configServer.staticFolder);

var webSocketCount = 0;
var webSocketClients = {};

// HTTP server
http.createServer(app).listen(app.get('port'), function() {
  console.log('HTTP server listening on port ' + app.get('port'));
}).on('upgrade', function(request, socket, body) {
  if (WebSocket.isWebSocket(request)) {
    var webSocket = new WebSocket(request, socket, body);
    // Specific id for this client & increment count
    var id = webSocketCount++;
    // store the socket so we can contact it when a message comes in
    webSocketClients[id] = webSocket;

    // new client connects to the server
    webSocket.on('open', function(event) {
      console.log('isVideoStreaming client connected');
      webSocket.send(`{ "isVideoStreaming": ${app.isVideoStreaming} }`);
    });

    // client disconnects from the server
    webSocket.on('close', function(event) {
      console.log('isVideoStreaming client disconnected', event.code, event.reason);
      delete webSocketClients[id];
      webSocket = null;
    });
  }
});

// Video streaming section
// Reference: https://github.com/phoboslab/jsmpeg/blob/master/stream-server.js

var STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes
// 720p webcam
var width = 1280;
var height = 720;

// WebSocket server
var wsServer = new (ws.Server)({ port: configServer.wsPort, verifyClient: limitClients });
console.log('WebSocket server listening on port ' + configServer.wsPort);

function limitClients(info, cb) {
  if (wsServer.clients.length >= 2) {
    if (cb) cb(false, 500, 'Too many clients');
    return false;
  }
  if (cb) cb(true, 200, 'Come on down!');
  return true;
}

wsServer.on('connection', function(socket) {
  // Send magic bytes and video size to the newly connected socket
  // struct { char magic[4]; unsigned short width, height;}
  var streamHeader = new Buffer(8);

  streamHeader.write(STREAM_MAGIC_BYTES);
  streamHeader.writeUInt16BE(width, 4);
  streamHeader.writeUInt16BE(height, 6);
  socket.send(streamHeader, { binary: true });

  console.log('New WebSocket Connection (' + wsServer.clients.length + ' total)');

  socket.on('close', function(code, message) {
    console.log('Disconnected WebSocket (' + wsServer.clients.length + ' total)');
  });
});

wsServer.broadcast = function(data, opts) {
  for (var i in this.clients) {
    // don't broadcast to more than 2 video streaming clients
    if (this.clients.indexOf(this.clients[i]) < 2) {
      if (this.clients[i].readyState === 1) {
        this.clients[i].send(data, opts);
      } else {
        console.log('Error: video streaming client (' + i + ') not connected.');
      }
    }
  }
};

function updateIsVideoStreaming(value) {
  app.isVideoStreaming = value;

  for (var id in webSocketClients) {
    if (webSocketClients[id].readyState === 1) {
      webSocketClients[id].send(`{ "isVideoStreaming": ${value} }`);
    } else {
      console.log('Error: isVideoStreaming client (' + webSocketClients[id] + ') not connected.');
    }
  }
}

// HTTP server to accept incoming MPEG1 stream
http.createServer(function(req, res) {
  console.log(
    'Stream Connected: ' + req.socket.remoteAddress +
    ':' + req.socket.remotePort + ' size: ' + width + 'x' + height
  );

  updateIsVideoStreaming(true);

  req.socket.on('close', function(data) {
    updateIsVideoStreaming(false);
  });

  req.on('data', function(data) {
    wsServer.broadcast(data, { binary: true });
  });
}).listen(configServer.streamPort, function() {
  console.log('Listening for video stream on port ' + configServer.streamPort);
});

export default app;
