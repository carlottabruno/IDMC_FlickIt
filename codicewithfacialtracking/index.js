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
let modalitaGioco = null; // "mano" | "viso"

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

// Hand Tracking
let handPose;
let video;
let hands = [];
let handX = 0;
let handY = 0;
let modelReady = false;

// Debounce pizzico — separato per gioco e pausa
let ultimoClickGioco = 0;
let ultimoClickPausa = 0;
const DEBOUNCE_MS = 600;

// Soglia pizzico in pixel (distanza pollice-indice)
const SOGLIA_PIZZICO = 35;

// FaceMesh tracking
let faceMesh;
let faces = [];
let faceX = 0; // coordinata naso mappata su canvas (specchiata)
let faceY = 0;
let faceMeshReady = false;

// Dwell click (viso): puntare e restare fermo per DWELL_MS millisecondi
const DWELL_MS        = 2000;   // ms per attivare il click
const DWELL_MOVE_THR  = 28;     // pixel: se il naso si sposta più del range si resetta
let dwellStartTime    = 0;      // millis() del momento in cui si è iniziato a puntare
let dwellTarget       = null;   // riferimento all'oggetto puntato (carta o bottone)
let dwellX            = 0;      // posizione naso x
let dwellY            = 0;      //posizione naso y
let dwellProgress     = 0;      // 0..1 per la barra visiva

// Debounce dwell separato per gioco e pausa
let ultimoDwellGioco  = 0;
let ultimoDwellPausa  = 0;
const DWELL_DEBOUNCE  = 800;    // ms dopo un'attivazione prima di accettarne un'altra

// Bottone menu modalità
let bottoneMano  = { x: 0, y: 0, w: 300, h: 100 };
let bottoneViso  = { x: 0, y: 0, w: 300, h: 100 };

// Suoni
let musicaBG;
let musicaFlip;

// Bottoni pausa — calcolati in setup()
let btnContinua  = { x: 0, y: 0, w: 320, h: 90 };
let btnMenuPausa = { x: 0, y: 0, w: 320, h: 90 };


function preload() {
  //loading immagini che occorrono nel gioco
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


// Riceve i dati della mano dal modello ML5.
function gotHands(results) {
  hands = results;
  if (hands.length === 0) return;

  let hand = hands[0];
  if (!hand.keypoints || hand.keypoints.length <= 8) return;

  // Punta indice
  handX = map(hand.keypoints[8].x, 0, 640, width, 0);
  handY = map(hand.keypoints[8].y, 0, 480, 0, height);

  // Distanza pollice (4)
  let thumb   = hand.keypoints[4];
  let index   = hand.keypoints[8];
  let d       = dist(thumb.x, thumb.y, index.x, index.y);
  let pizzico = (d < SOGLIA_PIZZICO);

  let ora = millis();//serve per avere un minimo di debounce tra un click e l'altro pochi milli secondi 

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

// Riceve i dati del viso da ml5.faceMesh.
// Usa il punto del naso (keypoint 1 in FaceMesh)
function gotFaces(results) {
  faces = results;
  if (faces.length === 0) return;

  let face = faces[0];
  // FaceMesh restituisce keypoints con struttura {x, y, z, name}
  // Il punto 1 è la punta del naso
  if (!face.keypoints || face.keypoints.length < 2) return;

  let nose  = face.keypoints[1]; // punta del naso
  faceX = map(nose.x, 0, 640, width, 0); // specchiato
  faceY = map(nose.y, 0, 480, 0, height);

  // Gestione dwell solo durante le schede di gioco e pausa
  if (schema === 2) aggiornaDwell("gioco");
  if (schema === 4) aggiornaDwell("pausa");
}

// Logica dwell: avvia/resetta/attiva il click
function aggiornaDwell(mode) {
  let ora  = millis();//prende i milli secondi in cui si è fermi in una posizione 
  let mossa = dist(faceX, faceY, dwellX, dwellY);

  if (mossa > DWELL_MOVE_THR) {
    // Testa mossa: resetta
    dwellStartTime = ora;
    dwellX         = faceX;
    dwellY         = faceY;
    dwellTarget    = null;
    dwellProgress  = 0;
    return;
  }

  // Testa ferma: calcola progresso
  let elapsed   = ora - dwellStartTime;
  dwellProgress = constrain(elapsed / DWELL_MS, 0, 1);

  if (dwellProgress >= 1) {
    // Attivazione!
    if (mode === "gioco" && ora - ultimoDwellGioco > DWELL_DEBOUNCE) {
      ultimoDwellGioco = ora;
      dwellClickGioco();
    }
    if (mode === "pausa" && ora - ultimoDwellPausa > DWELL_DEBOUNCE) {
      ultimoDwellPausa = ora;
      dwellClickPausa();
    }
    // Resetta progresso dopo l'attivazione
    dwellStartTime = ora + DWELL_DEBOUNCE; // pausa prima di poter riprendere
    dwellProgress  = 0;
  }
}


// Azione dwell viso durante il gioco (schema 2)
function dwellClickGioco() {
  if (bloccaClick) return;

  if (talpa && talpa.visibile && talpa.isMouseOver(faceX, faceY)) {
    talpa.preso(imgTalpaHit);
    punteggio += 2;
    return;
  }
  if (talpa && talpa.visibile) return;

  for (let n of carte) {
    if (n.isMouseOver(faceX, faceY) && !n.trovata && !n.girata &&
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


// Azione dwell viso nella schermata di pausa
function dwellClickPausa() {
  if (isInside(faceX, faceY, btnContinua)) {
    schema = 2;
    return;
  }
  if (isInside(faceX, faceY, btnMenuPausa)) {
    resetPartita();
    schema = 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  inizializzaCarte(livello);

  // Bottoni menu modalità affiancati
  bottoneMano.x = width / 2 - bottoneMano.w - 20;
  bottoneMano.y = height / 2 - bottoneMano.h / 2;
  bottoneViso.x = width / 2 + 20;
  bottoneViso.y = height / 2 - bottoneViso.h / 2;

  btnContinua.x  = width / 2 - btnContinua.w / 2;
  btnContinua.y  = height / 2 - 20;
  btnMenuPausa.x = width / 2 - btnMenuPausa.w / 2;
  btnMenuPausa.y = height / 2 + 110;

  // Avvia la webcam (senza microfono)
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

          //  HandPose
          handPose = ml5.handPose(video, function() {
            modelReady = true;
            handPose.detectStart(video, gotHands);
            console.log("HandPose pronto");
          });

          // FaceMesh
          faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: false }, function() {
            faceMeshReady = true;
            faceMesh.detectStart(video, gotFaces);
            console.log("FaceMesh pronto");
          });
        })
        .catch(err => alert("Errore telecamera: " + err));
    });
}

// Restituisce true se il punto (px,py) è dentro
// il rettangolo btn {x,y,w,h}
function isInside(px, py, btn) {
  return px > btn.x && px < btn.x + btn.w &&
         py > btn.y && py < btn.y + btn.h;
}

// Disegna un bottone evidenziando l'hover
// (mouse, mano o naso).
function disegnaBottone(btn, testo, coloreNorm, coloreHover) {
  let hoverMouse = isInside(mouseX, mouseY, btn);
  let hoverMano  = isInside(handX,  handY,  btn);
  let hoverViso  = isInside(faceX,  faceY,  btn);
  let hover      = hoverMouse || hoverMano || hoverViso;

  if (hoverViso) {
    stroke(0, 200, 255);   // bordo azzurro per il viso
    strokeWeight(6);
  } else if (hoverMano) {
    stroke(255, 230, 0);   // bordo giallo per la mano
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

  // Barra dwell sul bottone (solo se modalità viso)
  if (modalitaGioco === "viso" && hoverViso && dwellProgress > 0) {
    disegnaDwellBar(btn.x, btn.y + btn.h - 12, btn.w, dwellProgress);
  }

  return hover;
}


// Disegna la barra di caricamento dwell
function disegnaDwellBar(x, y, w, progress) {
  // Sfondo barra
  fill(50, 50, 50, 180);
  noStroke();
  rect(x, y, w, 10, 5);
  // Riempimento
  let col = lerpColor(color(0, 180, 255), color(0, 255, 120), progress);
  fill(col);
  rect(x, y, w * progress, 10, 5);
}

// Azione pizzico mano nella schermata di pausa
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
  dwellProgress  = 0;
  dwellStartTime = 0;
  dwellTarget    = null;
  inizializzaCarte(1);
}

// ─────────────────────────────────────────────
function draw() {

  // ── SCHEMA 4: PAUSA ──────────────────────────
  if (schema === 4) {
    background(20, 20, 40, 230);

    // Video in alto a destra (solo modalità che usano la cam)
    if ((modalitaGioco === "mano" || modalitaGioco === "viso") &&
        video && video.loadedmetadata) {
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

    // Cursori specifici per modalità
    if (modalitaGioco === "mano") {
      mostraHandTracking();
    } else if (modalitaGioco === "viso") {
      mostraFaceTracking();
    }

    return;
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

    // ── Bottone MANO ──
    let hoverMano = isInside(mouseX, mouseY, bottoneMano);
    fill(hoverMano ? color(100, 200, 100) : color(50, 150, 50));
    stroke(hoverMano ? 255 : 200);
    strokeWeight(hoverMano ? 4 : 2);
    rect(bottoneMano.x, bottoneMano.y, bottoneMano.w, bottoneMano.h, 20);
    fill(255);
    noStroke();
    textSize(40);
    text("  MANO", bottoneMano.x + bottoneMano.w / 2,
                     bottoneMano.y + bottoneMano.h / 2);

    // ── Bottone VISO ──
    let hoverViso = isInside(mouseX, mouseY, bottoneViso);
    fill(hoverViso ? color(100, 170, 255) : color(30, 100, 220));
    stroke(hoverViso ? 255 : 200);
    strokeWeight(hoverViso ? 4 : 2);
    rect(bottoneViso.x, bottoneViso.y, bottoneViso.w, bottoneViso.h, 20);
    fill(255);
    noStroke();
    textSize(40);
    text("  VISO", bottoneViso.x + bottoneViso.w / 2,
                    bottoneViso.y + bottoneViso.h / 2);

    // Descrizione
    fill(200);
    textSize(20);
    text("Clicca per giocare con i gesti della mano",
         bottoneMano.x + bottoneMano.w / 2, bottoneMano.y + bottoneMano.h + 30);
    text("Punta con la testa e aspetta per girare la carta",
         bottoneViso.x + bottoneViso.w / 2, bottoneViso.y + bottoneViso.h + 30);

    cursor((hoverMano || hoverViso) ? HAND : ARROW);
    return;
  }

  // ── SCHEMA 2: GIOCO ──────────────────────────
  if (schema === 2) {
    background(back);

    // Preview video specchiata in alto a destra
    if ((modalitaGioco === "mano" || modalitaGioco === "viso") &&
        video && video.loadedmetadata) {
      push();
      translate(width - 210, 10);
      scale(-1, 1);
      image(video, 0, 0, 200, 150);
      pop();
    }

    // ── Disegna carte ──
    for (let n of carte) {
      if (!n.trovata) {
        if (n.daRimuovere) {
          n.fadeOut();
          tint(255, n.alpha);
        } else {
          noTint();
        }
        image(n.imgShow, n.x, n.y);

        // Barra dwell sulla carta puntata (solo modalità viso)
        if (modalitaGioco === "viso" && !n.girata && !n.daRimuovere &&
            n.imgShow === imgC && n !== primaCarta &&
            n.isMouseOver(faceX, faceY) && dwellProgress > 0) {
          disegnaDwellBar(n.x, n.y + n.h - 12, n.w, dwellProgress);
        }
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
    text("Modalità: " + (modalitaGioco === "viso" ? " VISO" : "  MANO"),
         50, 100);

    // Istruzioni dwell
    if (modalitaGioco === "viso") {
      fill(180, 220, 255);
      textSize(18);
      text("Punta una carta con il naso e aspetta " + (DWELL_MS / 1000).toFixed(1) + "s per girarla",
           50, height - 30);
    }

    // Talpa
    if (talpa && talpa.visibile) {
      talpa.show();
      talpa.fadeOut();
      fill(255, 255, 0);
      textSize(32);
      textAlign(CENTER);
      text(" PRENDI LA TALPA PRIMA!  ", width / 2, height - 50);
    }

    // Cursori
    if (modalitaGioco === "mano") {
      mostraHandTracking();
    } else if (modalitaGioco === "viso") {
      mostraFaceTracking();
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
// Disegna il cursore e i punti del viso (naso)
// ─────────────────────────────────────────────
function mostraFaceTracking() {
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("FaceMesh: " + (faceMeshReady ? "✓" : "caricamento..."), 10, height - 60);
  text("Volti: " + faces.length, 10, height - 40);
  text("X:" + int(faceX) + "  Y:" + int(faceY), 10, height - 20);

  if (faces.length > 0) {
    // Disegna solo il naso come cursore
    // Cursore: cerchio azzurro con anello di progresso dwell
    let cx = faceX;
    let cy = faceY;

    // Anello di progresso dwell
    if (dwellProgress > 0) {
      noFill();
      stroke(0, 200, 255, 200);
      strokeWeight(5);
      let angolo = TWO_PI * dwellProgress;
      arc(cx, cy, 52, 52, -HALF_PI, -HALF_PI + angolo);
    }

    // Cerchio cursore
    fill(0, 180, 255, 180);
    stroke(255);
    strokeWeight(3);
    circle(cx, cy, 34);
    noStroke();
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
        let kx = map(kp.x, 0, 640, width, 0);
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
    if (isInside(mouseX, mouseY, bottoneViso)) {
      modalitaGioco = "viso";
      // Resetta lo stato dwell all'avvio della modalità viso
      dwellStartTime = millis();
      dwellX         = faceX;
      dwellY         = faceY;
      dwellProgress  = 0;
      schema = 2;
    }
    return;
  }
  // Modalità mouse (fallback, attiva solo se modalitaGioco NON è mano o viso)
  if (schema === 2 && modalitaGioco !== "mano" && modalitaGioco !== "viso") {
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
    if (schema === 2) {
      schema = 4;
      // Resetta dwell per evitare attivazioni accidentali in pausa
      dwellProgress  = 0;
      dwellStartTime = millis() + 500;
    } else if (schema === 4) {
      schema = 2;
      dwellProgress  = 0;
      dwellStartTime = millis() + 500;
    }
  }
}






    
