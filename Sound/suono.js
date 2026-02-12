let musica;
let suono;
let p = 1;

function preload() {
  musica = loadSound('sottofondo.mp3');
}

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textSize(20);
}


function draw() {

}

function keyPressed() {

  if(key == " " && p == 1){
      p++
      userStartAudio(); 
      musica.loop();    
      
  }

  if(key == "s") {
      userStartAudio();
      musica.pause();
      p = 1
    }

}