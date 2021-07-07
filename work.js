let serverVideo;
let state = "on";
let broker = {
  hostname: 'test.mosquitto.org',
  port: 8080
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

let tree1,tree2;

function preload() {
 h1 = loadFont('assets/ShipporiMincho-Bold.ttf');
 h2 = loadFont('assets/ShipporiMincho-Medium.ttf');
 keyImage = loadImage('assets/key.png');
 b1_on = loadImage('assets/b1_on.png');
 b1_off = loadImage('assets/b1_off.png');
 b2_on = loadImage('assets/b2_on.png');
 b2_off = loadImage('assets/b2_off.png');
 icon = loadImage('assets/icon.png');
 tree1 = loadImage('assets/tree1.jpg');
 tree2 = loadImage('assets/tree2.jpg');
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
  client.connect(
    {
        onSuccess: onConnect, 
    });
}

function draw() {
  //console.log(mouseX + ' ' + mouseY);
  new_mouseY = mouseY - window_pos;
  background(255); //Background
  
  push();
  if(gameState == 0){
    if(window_pos <= 0) {
      if(window_pos >= -2300){
        translate(0,window_pos); //Scrow down
      }else{
        translate(0,-2300); //Scrow down
      }
     
    }
    //背景图
    if(mouseX < width-300 && mouseX > 300 && new_mouseY < width-100 && new_mouseY > 100){
      tint(255, 200);
    }
    image(keyImage,width/2,height/2,0.4*width,keyImage.height/keyImage.width * 0.4 *width);

    //介紹
    textAlign(CENTER);
    fill(0);
    noStroke();
    textSize(26);
    textFont(h1);
    text("作品紹介",width/2,height+100);
    textSize(14);
    textAlign(LEFT);
    textFont(h2);
    noStroke();
    text("神が宿るとされる「神木」は、地域の御守りのような存在であり、参拝者と自然、神道文化を繋げる「結び」の役割も果たしている。\n\nそうした神木の中には、台風などの自然災害の被害を受けているもの多い。\n\n本作品では、壊れた神木も引き続き地域を見守り、結びの役割を続けられるように、神木を再生する新しい手法を考えた。\n\nウェブサイトの訪問者数に応じて、神木の状態が変化する。\n\nこれは住民が集まることで神木が再生することを表しており、新しい時代の巡礼の形になり得るだろう。",width/2-380,height+180);
    
    /*
    let show_b1;
    let b1_x = width/2;
    let b1_y = height+850;
    
    if(mouseX > b1_x-100 && mouseX < b1_x+100 && new_mouseY > b1_y-50 && new_mouseY < b1_y+50){
      show_b1 = b1_on;
    }else show_b1 = b1_off;
    image(show_b1,b1_x,b1_y,200,200*b1_off.height/b1_off.width);
    */
    
    //背景
    textAlign(CENTER);
    textSize(26);
    textFont(h1);
    text("背景",width/2,height+700);

    image(tree1,width/2,height+700+width*0.25,0.7*width,tree1.height/tree1.width *0.7* width);
    let s_y = height+1000+tree1.height/tree1.width *0.7* width/2+width*0.1;
    textSize(16);
    textAlign(LEFT);
    textFont(h1);
    text("「豪雨により樹齢1300年の御神木が倒れてしまった」",0.15*width, s_y);
    textFont(h2);
    textSize(14);
    text("2020年7月11日22時30分頃、豪雨の影響により、町民にとって心の拠り所だった、\n\n岐阜県瑞浪市大湫町神明神社にある推定樹齢1300年の大杉が根元から倒れました。\n\nこの大杉の推定樹齢は1300年で、幹周が11m、樹高が約60mでした。",0.15*width, s_y+width*0.04);
    
    image(tree2,width/2, s_y+100+width*0.25,0.7*width,tree2.height/tree2.width *0.7* width);

    text("いつまでも変わらず存在し続けそうな大杉が倒れ、町民たちは「自然」という大きな存在を改めて気づきました。\n\n気持ちを整理し、町民たちは、大杉との思い出から学んできたものを受け継いでいくと決めました。\n\n復興と未来に向かって、公的機関や町民の方々が積極的に対応策を協議し、スタートとして、去年にクラウドファンディングを実施しました。",0.15*width, s_y+100+width*0.40);
  
    

  }else if(gameState == 1){
    noFill();
    stroke(200);
    rectMode(CENTER);
    rect(width/2,height/2-70,0.8*640,0.8*480);
    if (serverVideo != null) {
      image(serverVideo,width/2,height/2-70,0.8*640,0.8*480);
    }else{
      textSize(16);
      fill(0);
      textAlign(CENTER);
      text("loading steaming . . .",width/2,height/2-70);
    }
    textSize(14);
    fill(0);
    noStroke();
    textAlign(LEFT);
    textFont(h2);
    text("上の生配信の映像に映っているのは、本作品の主体となる「テラリウム」であり、中に立っているのは枯木です。\n参拝・祈祷する際、拍手に神様への敬意を乗せるように、このページの下にあるボタンをクリックすると、\nあなたの思いがテラリウムに送信されます。そして、その思いが水になり、テラリウムにある木に滴り、一定量溜まると、\n枯木が生き返ったように、葉っぱのような結晶が咲きます。",width/2-350,height/2+170);
    if(b2_state == 0) image(b2_off,width/2,height-60,100,100);
    else if(b2_state == 1) image(b2_on,width/2,height-60,100,100);
  }
  pop();
  drawUp();
}

function gotStream(stream, id) {
  serverVideo = stream;
  serverVideo.hide();
}
function onConnect() {
  console.log(broker.hostname + "is connected");
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
  if(window_pos <= 0 && window_pos >= -2300){
    window_pos -= event.delta;
  }else if(window_pos > 0){
    window_pos = 0;
  }else if(window_pos < -2300){
    window_pos = -2300;
  }
}

function mouseClicked(){
  // if(gameState == 0){
  //   let b1_x = width/2;
  //   let b1_y = height+450;
  //   if(mouseX > b1_x-100 && mouseX < b1_x+100 && new_mouseY > b1_y-50 && new_mouseY < b1_y+50)
  //     gameState = 1;
  // }
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

  //click 背景
  if(mouseX > width-300 && mouseX < width-160 && mouseY > 20 && mouseY < 80){
    gameState = 0;
    window_pos = -height-630;
  }

  //click 作品体验
  if(mouseX < width-50 && mouseX > width-150 && mouseY < 80 && mouseY > 20){
    gameState = 1;
  }

  //click樹木
  if(mouseX < width-300 && mouseX > 300 && new_mouseY < width-100 && new_mouseY > 100){
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

function drawUp(){
  fill(0);
  noStroke();
  textSize(17);
  textAlign(CENTER);
  textFont(h1);
  image(icon,60,50,40,40);
  text('神木のテラリウム',160,57);
  text('作品紹介',width-360,55);
  text('背景',width-250,55);
  text('作品を体験する',width-100,55);

  if(mouseX < width+50 && mouseX > width-150 && mouseY < 80 && mouseY > 20){
    fill(0,100,0,40);
  }
  else{
    noFill();
  }
  
  stroke(0);
  rectMode(CENTER);
  rect(width-100,49,150,50,20);
  
}
