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

  render() {
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle="success" onClick={takePhoto}>Take Photo</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

ReactDOM.render(<Buttons />, document.getElementById('app'));
