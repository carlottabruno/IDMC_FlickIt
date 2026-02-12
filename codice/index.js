// Variabili globali
let back;
let carte = [];
let imgC;
let imgc1, imgc2, imgc3, imgc4, imgc5, imgc6,imgc7,imgc8,imgc9,imgc10,imgc11,imgc12,imgc13,imgc14,imgc15,imgc16;
let start;
let primaCarta = null;
let secondaCarta = null;
let bloccaClick = false;
let punteggio = 0;
let schema = 0;

// Talpa
let talpa = null;
let imgTalpa;
let imgTalpaHit;

// Coriandoli
let coriandoli = [];
let numCoriandoli = 150;

// Livelli
let livello = 1;

// ML5 Hand Tracking
let handPose;
let video;
let hands = [];
let handX = 0;
let handY = 0;
let ultimoClickGesturale = 0;
let modelReady = false;

function preload() {
  // Carica immagini
  back = loadImage('./img/tavolo.png');
  imgC = loadImage('./img/cartaR.png');
  imgc1 = loadImage('./img/carta1.png');
  imgc2 = loadImage('./img/carta2.png');
  imgc3 = loadImage('./img/carta3.png');
  imgc4 = loadImage('./img/carta4.png');
  imgc5 = loadImage('./img/carta5.png');
  imgc6 = loadImage('./img/carta6.png');
  imgc7=loadImage('./img/carta7.png');
  imgc8=loadImage('./img/carta8.png');
  imgc9=loadImage('.img/carta9.png');
  imgc10=loadImage('.img/carta10.png');
  imgc11=loadImage('./img/carta11.png');
  imgc12=loadImage
  imgc13=loadImage
  imgc14=loadImage
  imgc15=loadImage
  imgc16=loadImage
  start = loadImage('./img/start.jpg');
  imgTalpa = loadImage('./img/images.jpeg');
  imgTalpaHit = loadImage('./img/images1.jpeg');
}

function modelLoaded() {
  console.log('HandPose model loaded!');
  modelReady = true;
}

function gotHands(results) {
  hands = results;
  
  // Debug: mostra quando rileva mani
  if (hands.length > 0) {
    console.log("Mani rilevate:", hands.length, "Keypoints:", hands[0].keypoints ? hands[0].keypoints.length : "N/A");
  }

  if (hands.length > 0) {
    let hand = hands[0];
    
    // In ml5@1 latest, i keypoints sono in un array
    if (hand.keypoints && hand.keypoints.length > 8) {
      // Keypoint 8 = punta indice
      handX = map(hand.keypoints[8].x, 0, 640, 0, width);
      handY = map(hand.keypoints[8].y, 0, 480, 0, height);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  inizializzaCarte(livello);
  
  console.log("Setup iniziato...");
  
  // Inizializza webcam
  video = createCapture(VIDEO, function() {
    console.log("Video pronto!");
  });
  video.size(640, 480);
  video.hide();
  
  console.log("Video creato:", video);
  
  // Inizializza handPose per ml5@1 latest
  handPose = ml5.handPose(video, function() {
    console.log('HandPose model loaded!');
    modelReady = true;
    // AVVIA LA DETECTION SOLO DOPO CHE IL MODELLO È CARICATO
    handPose.detectStart(video, gotHands);
    console.log("Detection avviata");
  });
  
  console.log("HandPose creato:", handPose);
}

function draw() {
  // SCHEMA 0: Schermata iniziale
  if (schema === 0) {
    background(start);
    return;
  }

  // SCHEMA 1: Gioco attivo
  if (schema === 1) {
    background(back);

    // VIDEO DEBUG SEMPRE VISIBILE in alto a destra
    if (video && video.loadedmetadata) {
      push();
      translate(width - 210, 10);
      scale(-1, 1);
      image(video, 0, 0, 200, 150);
      pop();
    }

    // Disegna carte
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

    // UI
    noTint();
    fill(255);
    textSize(42);
    text("Punteggio: " + punteggio, 50, 50);
    text("Livello: " + livello, 800, 50);

    // Talpa
    if (talpa && talpa.visibile) {
      talpa.show();
      talpa.fadeOut();
    }

    // Controllo pizzico per click gesturale
    if (hands.length > 0) {
      let hand = hands[0];
      
      // Keypoint 4 = pollice, Keypoint 8 = indice
      if (hand.keypoints && hand.keypoints.length > 8) {
        let thumb = hand.keypoints[4];
        let index = hand.keypoints[8];
        let d = dist(thumb.x, thumb.y, index.x, index.y);

        // Debounce: almeno 500ms tra un click e l'altro
        if (d < 30 && millis() - ultimoClickGesturale > 500) {
          handClick();
          ultimoClickGesturale = millis();
        }
      }
    }

    // Debug: mostra hand tracking (opzionale)
    mostraHandTracking();
  }

  // SCHEMA 2: Schermata vittoria
  if (schema === 2) {
    background(back);

    // Coriandoli
    for (let c of coriandoli) {
      c.update();
      c.show();
    }

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(80);
    text("HAI VINTO!", width / 2, height / 2 - 100);
    textSize(40);
    text("Punteggio finale: " + punteggio, width / 2, height / 2);
  }
}

function mostraHandTracking() {
  // Debug info in basso a sinistra
  fill(255);
  noStroke();
  textSize(16);
  text("Model: " + (modelReady ? "✓" : "Loading..."), 10, height - 60);
  text("Hands: " + hands.length, 10, height - 40);
  text("Position: " + int(handX) + ", " + int(handY), 10, height - 20);
  
  // Mostra tutti i punti della mano
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    if (hand.keypoints) {
      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];
        fill(0, 255, 0);
        noStroke();
        let kx = map(keypoint.x, 0, 640, 0, width);
        let ky = map(keypoint.y, 0, 480, 0, height);
        circle(kx, ky, 10);
      }
    }
  }

  // Mostra cursore mano (più grande e visibile)
  if (hands.length > 0) {
    fill(255, 0, 0, 150);
    stroke(255);
    strokeWeight(3);
    circle(handX, handY, 30);
    noStroke();
  }
}

function inizializzaCarte(livello) {
  carte = [];

  if (livello === 1) {
    carte.push(new Carta(500, 200, imgC, 7, imgc1));
    carte.push(new Carta(700, 200, imgC, 5, imgc4));
    carte.push(new Carta(500, 450, imgC, 5, imgc3));
    carte.push(new Carta(700, 450, imgC, 7, imgc2));
  } else if (livello === 2) {
    carte.push(new Carta(400, 150, imgC, 10, imgc5));
    carte.push(new Carta(600, 150, imgC, 2, imgc7));
    carte.push(new Carta(800, 150, imgC, 67, imgc9));
    carte.push(new Carta(1000, 150, imgC, 2, imgc8));
    carte.push(new Carta(500, 400, imgC, 10, imgc6));
    carte.push(new Carta(700, 400, imgC, 67, imgc10));
  } else if (livello === 3) {
    carte.push(new Carta(300, 100, imgC, 60, imgc11));
    carte.push(new Carta(500, 100, imgC, 68, imgc ));
    carte.push(new Carta(700, 100, imgC, 13, imgc ));
    carte.push(new Carta(900, 100, imgC, 5, imgc5));
    carte.push(new Carta(1100, 100, imgC, 60, imgc12 ));
    carte.push(new Carta(400, 350, imgC, 5, imgc6));
    carte.push(new Carta(600, 350, imgC, 68, imgc ));
    carte.push(new Carta(800, 350, imgC, 13, imgc ));
    carte.push(new Carta(1000, 350, imgC, 67, imgc9));
    carte.push(new Carta(1200, 350, imgC, 67, imgc10));
  }
}

function controllaMatch() {
  if (primaCarta.val === secondaCarta.val) {
    // Match trovato!
    punteggio++;

    // Crea talpa bonus
    talpa = new Talpa(imgTalpa);

    primaCarta.daRimuovere = true;
    secondaCarta.daRimuovere = true;
    bloccaClick = true;

    setTimeout(() => {
      resetScelte();
      controllaVittoria();
    }, 2000);
  } else {
    // Nessun match
    setTimeout(() => {
      primaCarta.flip();
      secondaCarta.flip();
      resetScelte();
    }, 2000);
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
      // Passa al livello successivo
      livello++;
      inizializzaCarte(livello);
      primaCarta = null;
      secondaCarta = null;
      bloccaClick = false;
    } else {
      // Vittoria finale!
      schema = 2;
      coriandoli = [];
      for (let i = 0; i < numCoriandoli; i++) {
        coriandoli.push(new Coriandolo());
      }
    }
  }
}

function mouseClicked() {
  // Avvia il gioco dalla schermata iniziale
  if (schema === 0) {
    schema = 1;
    return;
  }

  if (bloccaClick) return;

  // Click sulla talpa
  if (talpa && talpa.visibile && talpa.isMouseOver(mouseX, mouseY)) {
    talpa.preso(imgTalpaHit);
    punteggio += 2;
    return;
  }

  // Click sulle carte
  for (let n of carte) {
    if (n.isMouseOver(mouseX, mouseY) && !n.trovata && !n.girata && n !== primaCarta && n.imgShow === imgC) {
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

function handClick() {
  if (bloccaClick) return;

  let mx = handX;
  let my = handY;

  // Click sulla talpa
  if (talpa && talpa.visibile && talpa.isMouseOver(mx, my)) {
    talpa.preso(imgTalpaHit);
    punteggio += 2;
    return;
  }

  // Click sulle carte
  for (let n of carte) {
    if (n.isMouseOver(mx, my) && !n.trovata && !n.girata && n !== primaCarta && n.imgShow === imgC) {
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








