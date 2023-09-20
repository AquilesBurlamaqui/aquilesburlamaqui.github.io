var xr;
var yr;

var medidaX;

var forceX;
var forceY;
 
function setup() {
    createCanvas(windowWidth, windowHeight);
    xr=windowWidth/2;
    yr=windowHeight/2;
    gyro.frequency = 10; 
    gyro.startTracking(function(o) {
        forceX = o.gamma/50;
        forceY = o.beta/50;
    });
}

function draw() {
    background(255);

    text("AcelX: "+accelerationX.toFixed(3)+" AcelY: "+accelerationY.toFixed(3)+" AcelZ: "+accelerationZ.toFixed(3), 10,windowHeight-30);
    text("GiroscX: "+forceX.toFixed(3)+" GiroscY: "+forceY.toFixed(3), 10,windowHeight-15);
  
    medidaX = ((windowWidth)/2)+(forceX*100); 
    medidaY = ((windowWidth)/2)+(forceY*150);
  
    if(medidaX>100 && medidaX<300) {
      xr=medidaX;
    } 
   
    if(medidaY>100 && medidaY<300) {
      yr=medidaY;
    }
    
    //área de controle  
    strokeWeight(3);
    rect(100,100,200,200,20);
  
    push();
      fill("black");
      //joystick
      circle(xr,yr, 75);  
      textSize(25);
      if(forceY<-0.2) {
        text("FRENTE", 150,350);
      }else if(forceY>0.5) {
        text("TRÁS", 150,350);
      }

      if(forceX<-0.7) {
        text("ESQUERDA", 150,375);
      } else if(forceX>0.7) {
        text("DIREITA", 150,375);
      }
    pop();
  
}

