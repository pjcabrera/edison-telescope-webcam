
function startStreaming() {
  $.ajax('/start_streaming')
  .done((data, textStatus, jqXHR) => {
    console.log('startStreaming ' + data);
  })
  .fail((jqXHR, textStatus, error) => {
    console.log('startStreaming ' + error);
  });
}

function stopStreaming() {
  $.ajax('/stop_streaming')
  .done((data, textStatus, jqXHR) => {
    console.log('stopStreaming ' + data);
  })
  .fail((jqXHR, textStatus, error) => {
    console.log('stopStreaming ' + error);
  });
}

function takePhoto() {
  $.ajax('/take_photo')
  .done((data, textStatus, jqXHR) => {
    console.log('takePhoto ' + data);
  })
  .fail((jqXHR, textStatus, error) => {
    console.log('takePhoto ' + error);
  });
}

const Button = ReactBootstrap.Button;
const ButtonToolbar = ReactBootstrap.ButtonToolbar;

class Buttons extends React.Component {
  constructor() {
    super();
    this.state = {
      isVideoStreaming: false
    };

    var myself = this;
    var interval = setInterval(() => {
      $.ajax('/is_video_streaming')
      .done((data, textStatus, jqXHR) => {
        console.log('isVideoStreaming ' + data);
        myself.setState({ isVideoStreaming: data === 'YES' });
      })
      .fail((jqXHR, textStatus, error) => {
        console.log('isVideoStreaming ' + error);
        clearInterval(interval);
      });
    }, 1000);
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
