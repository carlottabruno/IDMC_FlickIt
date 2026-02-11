let back;
let carta;
let carta2;
let carta3;
let carta4;
let carta5;
let carta6;
let carta7;
let carta8;
let carte=[];
let imgC;
let imgF;
let imgc1;
let imgc2;
let imgc3;
let imgc4;
let imgc5;
let imgc6;
let start;
let primaCarta = null;
let secondaCarta = null;
let bloccaClick = false;
let punteggio = 0;
let schema = 0;
//talpa
let talpa = null;
let imgTalpa;
let imgTalpaHit;
let coriandoli = [];
let numCoriandoli = 150; // puoi aumentare o diminuire



function preload() {
  back = loadImage('./img/tavolo.png');
  imgC=loadImage('./img/cartaR.png');
  imgF=loadImage('./img/carta.png');
  imgc1=loadImage('./img/carta1.png');
  imgc2=loadImage('./img/carta2.png');
  imgc3=loadImage('./img/carta3.png');
  imgc4=loadImage('./img/carta4.png');
  imgc5=loadImage('./img/carta5.png');
  imgc6=loadImage('./img/carta6.png');
  start=loadImage('./img/start.jpg');
  imgTalpa = loadImage('./img/images.jpeg');
  imgTalpaHit = loadImage('./img/images1.jpeg');

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  carta=new Carta(500,200,imgC,7,imgc1);
  carte.push(carta);
  carta2=new Carta(700,200,imgC,10,imgc3);
  carte.push(carta2);
  carta3=new Carta(900,200,imgC,5,imgc5);
  carte.push(carta3);
  carta4=new Carta(1100,200,imgC,7,imgc2);
  carte.push(carta4);

  //seconda riga
  carta5=new Carta(500,500,imgC,5,imgc6);
  carte.push(carta5);
  carta6=new Carta(700,500,imgC,10,imgc4);
  carte.push(carta6);
  carta7=new Carta(900,500,imgC,2,imgF);
  carte.push(carta7);
  carta8=new Carta(1100,500,imgC,2,imgF);
  carte.push(carta8);
  
}

function draw() {
  if(schema===1){
  background(back);

  for (let n of carte) {
    if (!n.trovata) {
      if (n.daRimuovere) {
        n.fadeOut();
        tint(255, n.alpha);
      } else {
        noTint();
      }
      image(n.imgShow, n.x, n.y);
    }
  }

  fill(255);
  textSize(32);
  text("Punteggio: " + punteggio, 50, 50);
  noTint();
  if (talpa && talpa.visibile) {
  talpa.show();
  talpa.fadeOut();
}

}
if(schema===0){
  background(start);
}
if(schema === 2){
  background(0);

  // aggiorna e mostra coriandoli
  for (let c of coriandoli) {
    c.update();
    c.show();
  }

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(80);
  text("HAI VINTO!", width/2, height/2 - 100);

  textSize(40);
  text("Punteggio finale: " + punteggio, width/2, height/2);

 
}

}

function controllaMatch() {

  if (primaCarta.val === secondaCarta.val) {

    punteggio++;

    // CREA TALPA
    talpa =new Talpa(imgTalpa);

    primaCarta.daRimuovere = true;
    secondaCarta.daRimuovere = true;

    bloccaClick = true;

    setTimeout(() => {
      resetScelte();
      controllaVittoria();
    }, 1000);

  } else {

    setTimeout(() => {
      primaCarta.flip();
      secondaCarta.flip();
      resetScelte();
    }, 1000);

  }
}



function resetScelte() {
  primaCarta = null;
  secondaCarta = null;
  bloccaClick = false;
}
function controllaVittoria() {
  let tutteTrovate = true;

  for (let n of carte) {
    if (!n.trovata) {
      tutteTrovate = false;
      break;
    }
  }
if (tutteTrovate) {
  schema = 2; // schermata finale
  // inizializza coriandoli
  coriandoli = [];
  for (let i = 0; i < numCoriandoli; i++) {
    coriandoli.push(new Coriandolo());
  }
}

}


function mouseClicked() {

  if (bloccaClick) return;


  if (talpa && talpa.visibile && talpa.isMouseOver()) {
    talpa.preso(imgTalpaHit);
    punteggio += 2;
    return;
  }

  // POI controlla le carte
  for (let n of carte) {
    if (n.isMouseOver() && !n.trovata && !n.girata && n !== primaCarta && n.imgShow === imgC) {

      n.flip();

      if (primaCarta === null) {
        primaCarta = n;
      } else {
        secondaCarta = n;
        bloccaClick = true;
        controllaMatch();
      }
      break;
    }
  }
}



function keyPressed(){
  if( schema===0 && key== " "){
    schema++;
  }
}



