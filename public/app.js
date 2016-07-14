function getURLParameter(parameterName) {
  const regEx = new RegExp('[?|&]' + parameterName + '=' + '([^&;]+?)(&|#|;|$)');
  const paramValuePair = (regEx.exec(location.search) || [null, '']);
  const parameterValue = paramValuePair[1].replace(/\+/g, '%20');
  return decodeURIComponent(parameterValue) || null;
}

function startStreaming() {
  $.ajax("/start_streaming")
  .done(function() {
  })
  .fail(function() {
    alert("startStreaming error");
  })
  .always(function() {
  });
}

function stopStreaming() {
  $.ajax("/stop_streaming")
  .done(function() {
  })
  .fail(function() {
    alert("stopStreaming error");
  })
  .always(function() {
  });
}

function takePhoto() {
  $.ajax("/take_photo")
  .done(function() {
  })
  .fail(function() {
    alert("takePhoto error");
  })
  .always(function() {
  });
}

const Button = ReactBootstrap.Button;
const ButtonToolbar = ReactBootstrap.ButtonToolbar;

var buttons = null;
if (getURLParameter('admin') === 'go') {
  buttons = (
    <ButtonToolbar>
      <Button bsStyle="success" onClick={startStreaming}>Start Streaming</Button>
      <Button bsStyle="danger" onClick={stopStreaming}>Stop Streaming</Button>
    </ButtonToolbar>
  );
} else {
  buttons = (
    <ButtonToolbar>
      <Button bsStyle="success" onClick={takePhoto}>Take Photo</Button>
    </ButtonToolbar>
  );
}

ReactDOM.render(buttons, document.getElementById('app'));
