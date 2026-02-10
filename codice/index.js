let back;
let carta;
let imgC;
let imgF;

function preload() {
  back = loadImage('./img/tavolo.png');
  imgC=loadImage('./img/cartaR.png');
  imgF=loadImage('./img/carta.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
   carta=new Carta(500,200,imgC,7);
}

function draw() {
  background(back);
 
  image(carta.imgShow,carta.x,carta.y);
}
function mouseClicked(){
  if(carta.isMouseOver()){
     carta.flip(imgF);
  }
  
}


