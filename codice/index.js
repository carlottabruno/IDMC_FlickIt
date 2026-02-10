let back;
let carta;
let carta2;
let carta3;
let carta4;
let carte=[];
let imgC;
let imgF;
let primaCarta = null;
let secondaCarta = null;
let bloccaClick = false;
let punteggio =0;


function preload() {
  back = loadImage('./img/tavolo.png');
  imgC=loadImage('./img/cartaR.png');
  imgF=loadImage('./img/carta.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  carta=new Carta(500,200,imgC,7);
  carte.push(carta);
  carta2=new Carta(700,200,imgC,10);
  carte.push(carta2);
  carta3=new Carta(900,200,imgC,10);
  carte.push(carta3);
  carta4=new Carta(1100,200,imgC,7);
  carte.push(carta4);
}

function draw() {
  background(back);
 
  //immagini carte 
  for(let n of carte){
    if(!n.trovata){
image(n.imgShow,n.x,n.y);
    }
            
        }

  //scritta punteggio
   fill(255);
  textSize(32);
  text("Punteggio: " + punteggio, 50, 50); 

}
function controllaMatch() {
  if (primaCarta.val === secondaCarta.val) {
    punteggio++;

    // aspetta 1 secondo prima di segnare le carte come trovate
    setTimeout(() => {
      primaCarta.trovata = true;
      secondaCarta.trovata = true;
      resetScelte(); // reset solo dopo 1 secondo
    }, 1000);

  } else {
    // se non è match, rigira le carte dopo 1 secondo
    setTimeout(() => {
      primaCarta.flip(imgC);
      secondaCarta.flip(imgC);
      resetScelte();
    }, 1000);
  }
}

function resetScelte() {
  primaCarta = null;
  secondaCarta = null;
  bloccaClick = false;
}

function mouseClicked() {
  if (bloccaClick) return;

  for (let n of carte) {
    if (n.isMouseOver() && !n.trovata && n !== primaCarta && n.imgShow === imgC) {
      n.flip(imgF);

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



