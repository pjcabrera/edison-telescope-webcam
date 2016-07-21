'use strict';

window.setupStreaming();

const jQuery = window.$;

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
    const isDisabled = !window.streamPlayer || !this.state.isVideoStreaming;
    const bsStyle = isDisabled ? 'regular' : 'success';
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle={bsStyle} disabled={isDisabled} onClick={takePhoto}>Take Photo</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

ReactDOM.render(<Buttons />, document.getElementById('app'));
