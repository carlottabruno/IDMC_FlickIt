let back;

function preload() {
  back = loadImage('./img/tavolo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
}

function draw() {
  background(back);
}



