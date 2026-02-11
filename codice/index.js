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
let numCoriandoli = 150; 
let livello = 1;  




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

   inizializzaCarte(livello);
  
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
  textSize(42);
  text("Punteggio: " + punteggio, 50, 50);
  text("Livello:  " + livello,800,50);
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
function inizializzaCarte(livello) {
  carte = [];

  if (livello === 1) {
    // livello 1: poche carte facili
    carte.push(new Carta(500,200,imgC,7,imgc1));
    carte.push(new Carta(700,200,imgC,7,imgc2));
    carte.push(new Carta(500,450,imgC,5,imgc3));
    carte.push(new Carta(700,450,imgC,5,imgc4));
  } else if (livello === 2) {
    // livello 2: più carte o valori diversi
    carte.push(new Carta(400,150,imgC,2,imgc1));
    carte.push(new Carta(600,150,imgC,2,imgc2));
    carte.push(new Carta(800,150,imgC,8,imgc3));
    carte.push(new Carta(1000,150,imgC,8,imgc4));
    carte.push(new Carta(500,400,imgC,10,imgc5));
    carte.push(new Carta(700,400,imgC,10,imgc6));
  } else if (livello === 3) {
    // livello 3: molte carte e valori più difficili
    carte.push(new Carta(300,100,imgC,1,imgc1));
    carte.push(new Carta(500,100,imgC,1,imgc2));
    carte.push(new Carta(700,100,imgC,3,imgc3));
    carte.push(new Carta(900,100,imgC,3,imgc4));
    carte.push(new Carta(1100,100,imgC,5,imgc5));
    carte.push(new Carta(400,350,imgC,5,imgc6));
    carte.push(new Carta(600,350,imgC,7,imgc1));
    carte.push(new Carta(800,350,imgC,7,imgc2));
    carte.push(new Carta(1000,350,imgC,9,imgc3));
    carte.push(new Carta(1200,350,imgC,9,imgc4));
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
    if (livello < 3) {
      livello++;       // passa al livello successivo
      inizializzaCarte(livello); // crea nuove carte
      primaCarta = null;
      secondaCarta = null;
      bloccaClick = false;
    } else {
      schema = 2; // fine gioco livello 3, schermata vittoria
      // inizializza coriandoli
      coriandoli = [];
      for (let i = 0; i < numCoriandoli; i++) {
        coriandoli.push(new Coriandolo());
      }
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



