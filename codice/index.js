let back;
let carta;
let imgC;
let imgF;

function preload() {
  back = loadImage('./img/tavolo.png');
  imgC=loadImage('./img/carta.png');
  imgF=loadImage('./img/sette.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
   carta=new Carta(200,200,imgC);
}

function draw() {
  background(back);
 
  image(carta.imgShow,carta.x,carta.y);
}
function mouseClicked(){
  carta.flip(imgF);
}


