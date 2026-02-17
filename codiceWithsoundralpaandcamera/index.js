// Variabili globali
let back;
let carte = [];
let imgC;
let imgc1, imgc2, imgc3, imgc4, imgc5, imgc6, imgc7, imgc8, imgc9, imgc10, imgc11, imgc12, imgc13, imgc14, imgc15, imgc16;
let start;
let primaCarta = null;
let secondaCarta = null;
let bloccaClick = false;
let punteggio = 0;
let schema = 0; // 0=start 1=menu 2=gioco 3=vittoria 4=pausa

// Modalità di gioco
let modalitaGioco = null;

// Talpa
let talpa = null;
let imgTalpa;
let imgTalpaHit;
let talpaSound;

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
let modelReady = false;

// Debounce pizzico — separato per gioco e pausa
let ultimoClickGioco = 0;
let ultimoClickPausa = 0;
const DEBOUNCE_MS    = 600;

// Soglia pizzico in pixel (distanza pollice-indice)
const SOGLIA_PIZZICO = 35;

// Bottone menu modalità
let bottoneMano = { x: 0, y: 0, w: 300, h: 100 };

// Suoni
let musicaBG;
let musicaFlip;

// Bottoni pausa — calcolati in setup()
let btnContinua  = { x: 0, y: 0, w: 320, h: 90 };
let btnMenuPausa = { x: 0, y: 0, w: 320, h: 90 };

// ─────────────────────────────────────────────
function preload() {
  back        = loadImage('./img/tavolo.png');
  imgC        = loadImage('./img/cartaR.png');
  imgc1       = loadImage('./img/carta1.png');
  imgc2       = loadImage('./img/carta2.png');
  imgc3       = loadImage('./img/carta3.png');
  imgc4       = loadImage('./img/carta4.png');
  imgc5       = loadImage('./img/carta5.png');
  imgc6       = loadImage('./img/carta6.png');
  imgc7       = loadImage('./img/carta7.png');
  imgc8       = loadImage('./img/carta8.png');
  imgc9       = loadImage('./img/carta9.png');
  imgc10      = loadImage('./img/carta10.png');
  imgc11      = loadImage('./img/carta11.png');
  imgc12      = loadImage('./img/carta12.png');
  imgc13      = loadImage('./img/carta13.png');
  imgc14      = loadImage('./img/carta14.png');
  imgc15      = loadImage('./img/carta15.png');
  imgc16      = loadImage('./img/carta16.png');
  start       = loadImage('./img/start.jpg');
  imgTalpa    = loadImage('./img/talpa.png');
  imgTalpaHit = loadImage('./img/coppa.png');
  musicaBG    = loadSound('./Suoni/sottofondo.mp3');
  musicaFlip  = loadSound('./Suoni/carte.wav');
  talpaSound  = loadSound('./Suoni/talpa.wav');
}

// ─────────────────────────────────────────────
// Riceve i dati della mano dal modello ML5.
// X è specchiata per corrispondere al video
// mostrato con scale(-1,1) nella preview.
// Il rilevamento del pizzico avviene QUI,
// una sola volta per frame video, con debounce
// separato per gioco (schema 2) e pausa (schema 4).
// ─────────────────────────────────────────────
function gotHands(results) {
  hands = results;
  if (hands.length === 0) return;

  let hand = hands[0];
  if (!hand.keypoints || hand.keypoints.length <= 8) return;

  // Punta indice — X invertita = specchiata
  handX = map(hand.keypoints[8].x, 0, 640, width, 0);
  handY = map(hand.keypoints[8].y, 0, 480, 0, height);

  // Distanza pollice (4) - indice (8) in coordinate raw
  let thumb  = hand.keypoints[4];
  let index  = hand.keypoints[8];
  let d      = dist(thumb.x, thumb.y, index.x, index.y);
  let pizzico = (d < SOGLIA_PIZZICO);

  let ora = millis();

  if (pizzico) {
    if (schema === 2 && ora - ultimoClickGioco > DEBOUNCE_MS) {
      ultimoClickGioco = ora;
      handClick();
    }
    if (schema === 4 && ora - ultimoClickPausa > DEBOUNCE_MS) {
      ultimoClickPausa = ora;
      handClickPausa();
    }
  }
}

// ─────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  inizializzaCarte(livello);

  bottoneMano.x = width / 2 - bottoneMano.w / 2;
  bottoneMano.y = height / 2 - bottoneMano.h / 2;

  btnContinua.x  = width / 2 - btnContinua.w / 2;
  btnContinua.y  = height / 2 - 20;
  btnMenuPausa.x = width / 2 - btnMenuPausa.w / 2;
  btnMenuPausa.y = height / 2 + 110;

  // Telecamera senza microfono
  navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      let telecameraEsterna = null;
      devices.forEach(function(device) {
        if (device.kind === 'videoinput') {
          if (!device.label.includes('FaceTime') &&
              !device.label.includes('Integrated')) {
            telecameraEsterna = device.deviceId;
          }
        }
      });

      let constraints = telecameraEsterna
        ? { video: { deviceId: { exact: telecameraEsterna }, width: 640, height: 480 }, audio: false }
        : { video: { width: 640, height: 480 }, audio: false };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          stream.getAudioTracks().forEach(t => t.stop());
          video = createCapture(VIDEO);
          video.elt.srcObject = stream;
          video.size(640, 480);
          video.hide();

          handPose = ml5.handPose(video, function() {
            modelReady = true;
            handPose.detectStart(video, gotHands);
            console.log("HandPose pronto");
          });
        })
        .catch(err => alert("Errore telecamera: " + err));
    });
}

// ─────────────────────────────────────────────
// Restituisce true se il punto (px,py) è dentro
// il rettangolo btn {x,y,w,h}
// ─────────────────────────────────────────────
function isInside(px, py, btn) {
  return px > btn.x && px < btn.x + btn.w &&
         py > btn.y && py < btn.y + btn.h;
}

// ─────────────────────────────────────────────
// Disegna un bottone evidenziando l'hover
// sia per il mouse sia per la mano.
// Restituisce true se c'è hover (per il cursore).
// ─────────────────────────────────────────────
function disegnaBottone(btn, testo, coloreNorm, coloreHover) {
  let hoverMouse = isInside(mouseX, mouseY, btn);
  let hoverMano  = isInside(handX,  handY,  btn);
  let hover      = hoverMouse || hoverMano;

  // Bordo giallo quando la mano è sopra il bottone
  if (hoverMano) {
    stroke(255, 230, 0);
    strokeWeight(6);
  } else {
    stroke(255);
    strokeWeight(3);
  }

  fill(hover ? coloreHover : coloreNorm);
  rect(btn.x, btn.y, btn.w, btn.h, 15);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(36);
  text(testo, btn.x + btn.w / 2, btn.y + btn.h / 2);

  return hover;
}

// ─────────────────────────────────────────────
// Azione pizzico mano nella schermata di pausa
// ─────────────────────────────────────────────
function handClickPausa() {
  if (isInside(handX, handY, btnContinua)) {
    schema = 2;
    return;
  }
  if (isInside(handX, handY, btnMenuPausa)) {
    resetPartita();
    schema = 0;
  }
}

// ─────────────────────────────────────────────
function resetPartita() {
  livello       = 1;
  punteggio     = 0;
  primaCarta    = null;
  secondaCarta  = null;
  bloccaClick   = false;
  talpa         = null;
  modalitaGioco = null;
  inizializzaCarte(1);
}

// ─────────────────────────────────────────────
function draw() {

  // ── SCHEMA 4: PAUSA ──────────────────────────
  if (schema === 4) {
    background(20, 20, 40, 230);
      // video visibile anche in pausa
    if (modalitaGioco === "mano" && video && video.loadedmetadata) {
      push();
      translate(width - 210, 10);
      scale(-1, 1);
      image(video, 0, 0, 200, 150);
      pop();
    }

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(90);
    text("⏸ PAUSA", width / 2, height / 2 - 180);

    textSize(30);
    fill(200);
    text("Livello " + livello + "   ·   Punteggio " + punteggio,
         width / 2, height / 2 - 95);

    let hC = disegnaBottone(btnContinua,  "▶  CONTINUA", color(50,150,50),  color(80,220,80));
    let hM = disegnaBottone(btnMenuPausa, "  MENU",    color(150,50,50),  color(220,80,80));

    fill(160);
    noStroke();
    textSize(20);
    text("SPAZIO per riprendere", width / 2, height / 2 + 240);

    cursor(hC || hM ? HAND : ARROW);

    // Cursore mano visibile in pausa
    if (modalitaGioco === "mano") {
      mostraHandTracking();
    }

    return; // non eseguire gli altri schemi nello stesso frame
  }

  // ── SCHEMA 0: START ──────────────────────────
  if (schema === 0) {
    background(start);
    if (musicaBG && !musicaBG.isPlaying()) {
      musicaBG.setVolume(0.4);
      musicaBG.loop();
    }
    return;
  }

  // ── SCHEMA 1: MENU MODALITÀ ──────────────────
  if (schema === 1) {
    background(back);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(60);
    text("SCEGLI COME GIOCARE", width / 2, height / 2 - 200);

    let hover = isInside(mouseX, mouseY, bottoneMano);
    fill(hover ? color(100, 200, 100) : color(50, 150, 50));
    stroke(hover ? 255 : 200);
    strokeWeight(hover ? 4 : 2);
    rect(bottoneMano.x, bottoneMano.y, bottoneMano.w, bottoneMano.h, 20);

    fill(255);
    noStroke();
    textSize(40);
    text("  MANO", bottoneMano.x + bottoneMano.w / 2,
                     bottoneMano.y + bottoneMano.h / 2);
    fill(200);
    textSize(20);
    text("Clicca per giocare con i gesti della mano",
         width / 2, height / 2 + 100);
    return;
  }

  // ── SCHEMA 2: GIOCO ──────────────────────────
  if (schema === 2) {
    background(back);

    // Preview video specchiata in alto a destra
    if (modalitaGioco === "mano" && video && video.loadedmetadata) {
      push();
      translate(width - 210, 10);
      scale(-1, 1);
      image(video, 0, 0, 200, 150);
      pop();
    }

    // Carte
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

    noTint();
    fill(255);
    noStroke();
    textSize(42);
    textAlign(LEFT);
    text("Punteggio: " + punteggio, 50, 50);
    text("Livello: " + livello, 800, 50);
    textSize(24);
    fill(200);
    text("Modalità:  MANO", 50, 100);

    // Talpa
    if (talpa && talpa.visibile) {
      talpa.show();
      talpa.fadeOut();
      fill(255, 255, 0);
      textSize(32);
      textAlign(CENTER);
      text(" PRENDI LA TALPA PRIMA!  ", width / 2, height - 50);
    }

    if (modalitaGioco === "mano") {
      mostraHandTracking();
    }
    return;
  }

  // ── SCHEMA 3: VITTORIA ───────────────────────
  if (schema === 3) {
    background(back);
    for (let c of coriandoli) {
      c.update();
      c.show();
    }
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(80);
    text("HAI VINTO! ", width / 2, height / 2 - 100);
    textSize(40);
    text("Punteggio finale: " + punteggio, width / 2, height / 2);
  }
}

// ─────────────────────────────────────────────
// Disegna punti mano e cursore indice (specchiati)
// ─────────────────────────────────────────────
function mostraHandTracking() {
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("Model: " + (modelReady ? "✓" : "caricamento..."), 10, height - 60);
  text("Hands: " + hands.length, 10, height - 40);
  text("X:" + int(handX) + "  Y:" + int(handY), 10, height - 20);

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    if (hand.keypoints) {
      for (let j = 0; j < hand.keypoints.length; j++) {
        let kp = hand.keypoints[j];
        let kx = map(kp.x, 0, 640, width, 0); // specchiato
        let ky = map(kp.y, 0, 480, 0, height);
        fill(0, 255, 0);
        noStroke();
        circle(kx, ky, 10);
      }
    }
  }

  if (hands.length > 0) {
    fill(255, 0, 0, 180);
    stroke(255);
    strokeWeight(3);
    circle(handX, handY, 34);
    noStroke();
  }
}

// ─────────────────────────────────────────────
function inizializzaCarte(lv) {
  carte = [];
  if (lv === 1) {
    carte.push(new Carta(500, 200, imgC, 7,  imgc1));
    carte.push(new Carta(700, 200, imgC, 5,  imgc4));
    carte.push(new Carta(500, 450, imgC, 5,  imgc3));
    carte.push(new Carta(700, 450, imgC, 7,  imgc2));
  } else if (lv === 2) {
    carte.push(new Carta(400, 150, imgC, 10, imgc5));
    carte.push(new Carta(600, 150, imgC, 2,  imgc7));
    carte.push(new Carta(800, 150, imgC, 67, imgc9));
    carte.push(new Carta(1000,150, imgC, 2,  imgc8));
    carte.push(new Carta(500, 400, imgC, 10, imgc6));
    carte.push(new Carta(700, 400, imgC, 67, imgc10));
  } else if (lv === 3) {
    carte.push(new Carta(300, 100, imgC, 60, imgc11));
    carte.push(new Carta(500, 100, imgC, 68, imgc15));
    carte.push(new Carta(700, 100, imgC, 13, imgc13));
    carte.push(new Carta(900, 100, imgC, 5,  imgc5));
    carte.push(new Carta(1100,100, imgC, 60, imgc12));
    carte.push(new Carta(400, 350, imgC, 5,  imgc6));
    carte.push(new Carta(600, 350, imgC, 68, imgc16));
    carte.push(new Carta(800, 350, imgC, 13, imgc14));
    carte.push(new Carta(1000,350, imgC, 67, imgc9));
    carte.push(new Carta(1200,350, imgC, 67, imgc10));
  }
}

// ─────────────────────────────────────────────
function controllaMatch() {
  if (primaCarta.val === secondaCarta.val) {
    punteggio++;
    talpa = new Talpa(imgTalpa);
    primaCarta.daRimuovere  = true;
    secondaCarta.daRimuovere = true;
    bloccaClick = true;
    setTimeout(() => { resetScelte(); controllaVittoria(); }, 2000);
  } else {
    setTimeout(() => {
      primaCarta.flip();
      secondaCarta.flip();
      resetScelte();
    }, 2000);
  }
}

function resetScelte() {
  primaCarta   = null;
  secondaCarta = null;
  bloccaClick  = false;
}

function controllaVittoria() {
  let tutteTrovate = carte.every(n => n.trovata);
  if (tutteTrovate) {
    if (livello < 3) {
      livello++;
      inizializzaCarte(livello);
      resetScelte();
    } else {
      schema = 3;
      coriandoli = [];
      for (let i = 0; i < numCoriandoli; i++) coriandoli.push(new Coriandolo());
    }
  }
}

// ─────────────────────────────────────────────
// Click mano durante il gioco (schema 2)
// ─────────────────────────────────────────────
function handClick() {
  if (bloccaClick) return;

  if (talpa && talpa.visibile && talpa.isMouseOver(handX, handY)) {
    talpa.preso(imgTalpaHit);
    punteggio += 2;
    return;
  }
  if (talpa && talpa.visibile) return;

  for (let n of carte) {
    if (n.isMouseOver(handX, handY) && !n.trovata && !n.girata &&
        n !== primaCarta && n.imgShow === imgC) {
      n.flip();
      if (musicaFlip) musicaFlip.play();
      if (primaCarta === null) {
        primaCarta = n;
      } else {
        secondaCarta = n;
        bloccaClick  = true;
        controllaMatch();
      }
      break;
    }
  }
}

// ─────────────────────────────────────────────
// Click mouse
// ─────────────────────────────────────────────
function mouseClicked() {
  if (schema === 4) {
    if (isInside(mouseX, mouseY, btnContinua))  { schema = 2; return; }
    if (isInside(mouseX, mouseY, btnMenuPausa)) { resetPartita(); schema = 0; return; }
    return;
  }
  if (schema === 0) { schema = 1; return; }
  if (schema === 1) {
    if (isInside(mouseX, mouseY, bottoneMano)) {
      modalitaGioco = "mano";
      schema = 2;
    }
    return;
  }
  if (schema === 2 && modalitaGioco !== "mano") {
    if (bloccaClick) return;
    if (talpa && talpa.visibile && talpa.isMouseOver(mouseX, mouseY)) {
      talpa.preso(imgTalpaHit); punteggio += 2; return;
    }
    if (talpa && talpa.visibile) return;
    for (let n of carte) {
      if (n.isMouseOver(mouseX, mouseY) && !n.trovata && !n.girata &&
          n !== primaCarta && n.imgShow === imgC) {
        n.flip();
        if (musicaFlip) musicaFlip.play();
        if (primaCarta === null) { primaCarta = n; }
        else { secondaCarta = n; bloccaClick = true; controllaMatch(); }
        break;
      }
    }
  }
}

// ─────────────────────────────────────────────
// Tasti
// ─────────────────────────────────────────────
function keyPressed() {
  if (key === ' ') {
    if (schema === 2) schema = 4;
    else if (schema === 4) schema = 2;
  }
}






    
