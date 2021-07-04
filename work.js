let serverVideo;
let state = "on";
let broker = {
  hostname: 'broker.hivemq.com',
  port: 8000
};
let client;
let topic = 'drop';

let window_pos = 0;
let h1;
let h2;
let gameState = 0;

let keyImage;
let b1_off;
let b1_on;
let icon;
let b2_off;
let b2_on;
let b2_state = 0;

let new_mouseY;

function preload() {
 h1 = loadFont('assets/ShipporiMincho-Bold.ttf');
 h2 = loadFont('assets/ShipporiMincho-Medium.ttf');
 keyImage = loadImage('assets/key.png');
 b1_on = loadImage('assets/b1_on.png');
 b1_off = loadImage('assets/b1_off.png');
 b2_on = loadImage('assets/b2_on.png');
 b2_off = loadImage('assets/b2_off.png');
 icon = loadImage('assets/icon.png');
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  textAlign(CENTER);
  imageMode(CENTER);

  //Live stream
  let p5l = new p5LiveMedia(this, "CAPTURE", serverVideo, "jZQ64AMJc_TESTTEST");
  p5l.on('stream', gotStream);

  //MQTT 
  client = new Paho.MQTT.Client(broker.hostname, broker.port, "p5_Client");
  client.onConnectionLost = onConnectionLost;
  client.connect({onSuccess: onConnect,});
}

function draw() {
  console.log(mouseX + ' ' + mouseY);
  new_mouseY = mouseY - window_pos;
  background(78); //Background
  fill(233);
  noStroke();
  textSize(17);
  textAlign(CENTER);
  textFont(h2);
  image(icon,60,50,40,40);
  text('神木のテラリウム',160,55);
  text('作品紹介',width-360,55);
  text('背景',width-250,55);
  text('作品を体験する',width-100,55);

  if(mouseX < width+50 && mouseX > width-150 && mouseY < 80 && mouseY > 20){
    fill(233,40);
  }
  else{
    noFill();
  }
  
  stroke(233);
  rectMode(CENTER);
  rect(width-100,50,150,50,20);
  
  if(gameState == 0){
    if(window_pos <= 0) translate(0,window_pos); //Scrow down
    //背景图
    image(keyImage,width/2,height/2,0.4*width,keyImage.height/keyImage.width * 0.4 *width);


    //介紹
    textAlign(CENTER);
    fill(230);
    noStroke();
    textSize(28);
    textFont(h1);
    text("作品紹介",width/2,height+100);
    stroke(230);
    line(width/2-80,height+110,width/2+80,height+110);
    textSize(16);
    textAlign(LEFT);
    textFont(h2);
    noStroke();
    text("神が宿るとされる「神木」は、地域の御守りのような存在であり、\n参拝者と自然、神道文化を繋げる「結び」の役割も果たしている。\nそうした神木の中には、台風などの自然災害の被害を受けているもの多い。\n本作品では、壊れた神木も引き続き地域を見守り、\n結びの役割を続けられるように、神木を再生する新しい手法を考えた。\nウェブサイトの訪問者数に応じて、神木の状態が変化する。\nこれは住民が集まることで神木が再生することを表しており、\n新しい時代の巡礼の形になり得るだろう。",width/2-240,height+180);
    let show_b1;
    let b1_x = width/2;
    let b1_y = height+450;
    
    if(mouseX > b1_x-100 && mouseX < b1_x+100 && new_mouseY > b1_y-50 && new_mouseY < b1_y+50){
      show_b1 = b1_on;
    }else show_b1 = b1_off;
    image(show_b1,b1_x,b1_y,200,200*b1_off.height/b1_off.width);
    
    // //背景
    // textAlign(CENTER);
    // textSize(30);
    // textFont(topic);
    // text("背景",width/2,height+700);
    // line(width/2-80,height+710,width/2+80,height+710);

  }else if(gameState == 1){
    noFill();
    stroke(230);
    rectMode(CENTER);
    rect(width/2,height/2-70,0.8*640,0.8*480);
    if (serverVideo != null) {
      image(serverVideo,width/2,height/2-70,0.8*640,0.8*480);
    }else{
      textSize(16);
      fill(233);
      textAlign(CENTER);
      text("loading steaming . . .",width/2,height/2-70);
    }
    textSize(16);
    fill(233);
    noStroke();
    textAlign(LEFT);
    text("上の生配信の映像に映っているのは、本作品の主体となる「テラリウム」であり、中に立っているのは枯木です。\n参拝・祈祷する際、拍手に神様への敬意を乗せるように、このページの下にあるボタンをクリックすると、\nあなたの思いがテラリウムに送信されます。そして、その思いが水になり、テラリウムにある木に滴り、一定量溜まると、\n枯木が生き返ったように、葉っぱのような結晶が咲きます。",width/2-400,height/2+170);
    if(b2_state == 0) image(b2_off,width/2,height-60,100,100);
    else if(b2_state == 1) image(b2_on,width/2,height-60,100,100);
  }
}

function mousePressed() {
  sendMqttMessage(state);
}

function gotStream(stream, id) {
  serverVideo = stream;
  serverVideo.hide();
}
function onConnect() {
  console.log("new client is connected");
}

function onConnectionLost(response) {
  if (response.errorCode !== 0) {
      console.log('onConnectionLost:' + response.errorMessage);
  }
  client.connect({onSuccess: onConnect,});
}

function sendMqttMessage(msg) {
  if (client.isConnected()) {
      message = new Paho.MQTT.Message(msg);
      message.destinationName = topic;
      client.send(message);
      console.log('I sent: ' + message.payloadString);
  }
}

function mouseWheel(event) {
  if(window_pos <= 0){
    window_pos -= event.delta;
  }else{
    window_pos = 0;
  } 
}

function mouseClicked(){
  if(gameState == 0){
    let b1_x = width/2;
    let b1_y = height+450;
    if(mouseX > b1_x-100 && mouseX < b1_x+100 && new_mouseY > b1_y-50 && new_mouseY < b1_y+50)
      gameState = 1;
  }
  //click icon
  if(mouseX > 42 && mouseX < 233 && mouseY > 0 && mouseY < 80){
    gameState = 0;
    window_pos = 0;
  }

  //click 作品介绍
  if(mouseX > width-400 && mouseX < width-300 && mouseY > 20 && mouseY < 80){
    gameState = 0;
    window_pos = -height+100;
  }

  //click 作品体验
  if(mouseX < width+50 && mouseX > width-150 && mouseY < 80 && mouseY > 20){
    gameState = 1;
  }

}
function mousePressed(){
  if(gameState == 1 && b2_state == 0 && mouseX > width/2-50 && mouseX < width/2+50 && mouseY > height - 60 - 50 && mouseY < height - 60 + 50){
    b2_state = 1;
  }
}
function mouseReleased(){
  if(b2_state == 1){
    b2_state = 0;
    sendMqttMessage('on');
  }
}
