'use strict';

// Show loading notice
var canvas = document.getElementById('canvas-video');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#333';
ctx.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3);

const JSMPEG = window.jsmpeg;

// Start the player
var client = new window.WebSocket('ws://' + document.domain + ':8084');
var player = new JSMPEG(client, { canvas: canvas });
player;

const jQuery = window.$;

function startStreaming() {
  jQuery.ajax('/start_streaming')
  .done((data, textStatus, jqXHR) => {
    console.log('startStreaming ' + data);
  })
  .fail((jqXHR, textStatus, error) => {
    console.log('startStreaming ' + error);
  });
}

function stopStreaming() {
  jQuery.ajax('/stop_streaming')
  .done((data, textStatus, jqXHR) => {
    console.log('stopStreaming ' + data);
  })
  .fail((jqXHR, textStatus, error) => {
    console.log('stopStreaming ' + error);
  });
}

function takePhoto() {
  jQuery.ajax('/take_photo')
  .done((data, textStatus, jqXHR) => {
    console.log('takePhoto ' + data);
  })
  .fail((jqXHR, textStatus, error) => {
    console.log('takePhoto ' + error);
  });
}

const React = window.React;
const ReactDOM = window.ReactDOM;
const Button = window.ReactBootstrap.Button;
const ButtonToolbar = window.ReactBootstrap.ButtonToolbar;

class Buttons extends React.Component {

  constructor() {
    super();
    this.state = {
      isVideoStreaming: false
    };
  }

  componentWillMount() {
    const wsClient = new window.WebSocket('ws://' + document.domain + ':8080');
    wsClient.onmessage = (event) => {
      if (event.data.contains('isVideoStreaming')) {
        const data = JSON.parse(event.data);
        this.setState({ isVideoStreaming: data.isVideoStreaming });
      }
    };
  }

  render() {
    var bsStyle = this.state.isVideoStreaming ? 'danger' : 'success';
    var buttonText = this.state.isVideoStreaming ? 'Stop Streaming' : 'Start Streaming';
    var clickHandler = this.state.isVideoStreaming ? stopStreaming : startStreaming;
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle={bsStyle} onClick={clickHandler}>{buttonText}</Button>
          <Button bsStyle="success" onClick={takePhoto}>Take Photo</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

ReactDOM.render(<Buttons />, document.getElementById('app'));
