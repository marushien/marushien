let serverVideo;
let state = "on";
let broker = {
  hostname: 'broker.hivemq.com',
  port: 8000
};
let client;
let topic = 'drop';


function setup() {
  createCanvas(640, 480);
  let p5l = new p5LiveMedia(this, "CAPTURE", serverVideo, "jZQ64AMJc_TESTTEST");
  p5l.on('stream', gotStream);

  client = new Paho.MQTT.Client(broker.hostname, broker.port, "p5_Client");
  client.onConnectionLost = onConnectionLost;
  client.connect({onSuccess: onConnect,});
}

function draw() {
  background(220);
  if (serverVideo != null) {
    image(serverVideo,0,0);
  }  
}

function gotStream(stream, id) {
  serverVideo = stream;
  serverVideo.hide();
}

function mousePressed() {
  sendMqttMessage(state);
  if(state == "on") state = "off";
  else state = "on";
}

function onConnect() {
  console.log("new client is connected");
}

function onConnectionLost(response) {
  if (response.errorCode !== 0) {
      console.log('onConnectionLost:' + response.errorMessage);
  }
}

function sendMqttMessage(msg) {
  if (client.isConnected()) {
      message = new Paho.MQTT.Message(msg);
      message.destinationName = topic;
      client.send(message);
      console.log('I sent: ' + message.payloadString);
  }
}
