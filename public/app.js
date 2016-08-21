'use strict';

window.setupStreaming();

const jQuery = window.$;

function takePhoto() {
  jQuery.ajax('/take_photo')
  .done((data, textStatus, jqXHR) => {
    console.log('takePhoto ' + data);
    // the about:blank is to please Chrome, and _blank to please Firefox
    window.open(data, 'about:blank', '_blank');
  })
  .fail((jqXHR, textStatus, error) => {
    console.log('takePhoto ' + error);
  });
}

var streamPlayerCheckInterval;

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
      if (event.data) {
        const data = JSON.parse(event.data);
        this.setState({ isVideoStreaming: data.isVideoStreaming });
      }
    };

    streamPlayerCheckInterval = setInterval(() => {
      if (window.streamPlayer) {
        this.setState({ hasStreamPlayer: true });
        clearInterval(streamPlayerCheckInterval);
      }
    }, 250);
  }

  render() {
    const isEnabled = this.state.hasStreamPlayer && this.state.isVideoStreaming;
    const bsStyle = isEnabled ? 'success' : 'regular';
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle={bsStyle} disabled={!isEnabled} onClick={takePhoto}>Take Photo</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

ReactDOM.render(<Buttons />, document.getElementById('app'));
