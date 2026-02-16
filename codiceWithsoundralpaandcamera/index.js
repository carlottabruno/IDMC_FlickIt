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
let schema = 0; // 0 = start, 1 = menu, 2 = gioco, 3 = vittoria

// Modalità di gioco
let modalitaGioco = null; // "mano" o "mouse" (per ora solo "mano")

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

// Bottoni menu
let bottoneMano = {
  x: 0,
  y: 0,
  w: 300,
  h: 100
};
//suoni
let musicaBG;
let musicaFlip;

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
  imgc9=loadImage('./img/carta9.png');
  imgc10=loadImage('./img/carta10.png');
  imgc11=loadImage('./img/carta11.png');
  imgc12=loadImage('./img/carta12.png');
  imgc13=loadImage('./img/carta13.png');
  imgc14=loadImage('./img/carta14.png');
  imgc15=loadImage('./img/carta15.png');
  imgc16=loadImage('./img/carta16.png');
  start = loadImage('./img/start.jpg');
  imgTalpa = loadImage('./img/talpa.png');
  imgTalpaHit = loadImage('./img/coppa.png');
  //load soundS
  musicaBG = loadSound('./Suoni/sottofondo.mp3');
  musicaFlip = loadSound('./Suoni/carte.wav')
  talpaSound = loadSound('./Suoni/talpa.wav')
}
//modello mano 
function modelLoaded() {
  console.log('HandPose model loaded!');
  modelReady = true;
}
//punti della mano ricevuti 
function gotHands(results) {
  hands = results;
  if (hands.length > 0) {
    let hand = hands[0];
    //  i keypoints sono in un array
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
  
  // Posiziona bottone al centro
  bottoneMano.x = width / 2 - bottoneMano.w / 2;
  bottoneMano.y = height / 2 - bottoneMano.h / 2;
  console.log("Setup iniziato...");
  

  // TROVA E USA TELECAMERA ESTERNA - SENZA MICROFONO
  navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      console.log("📹 Telecamere disponibili:");
      let telecameraEsterna = null;
      devices.forEach(function(device) {
        if (device.kind === 'videoinput') {
          console.log("- " + device.label + " (ID: " + device.deviceId + ")");
          // Cerca telecamera esterna (NON "FaceTime" o "Integrated")
          if (!device.label.includes('FaceTime') && 
              !device.label.includes('Integrated')) {
            telecameraEsterna = device.deviceId;
          }
        }
      });
      // IMPORTANTE: Configura constraints per DISABILITARE IL MICROFONO
      let constraints;
      if (telecameraEsterna) {
        console.log("Uso telecamera esterna SENZA microfono!");
        constraints = {
          video: {
            deviceId: { exact: telecameraEsterna },
            width: 640,
            height: 480
          },
          audio: false  //  DISABILITA ESPLICITAMENTE IL MICROFONO
        };
      } else {
        console.log(" Uso telecamera predefinita SENZA microfono");
        constraints = {
          video: {
            width: 640,
            height: 480
          },
          audio: false  //  DISABILITA ESPLICITAMENTE IL MICROFONO
        };
      }
      // Inizializza video con getUserMedia direttamente per maggiore controllo
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          console.log(" Stream video ottenuto senza audio!");
          // Verifica che non ci siano tracce audio
          let audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) {
            console.warn(" Tracce audio rilevate, le rimuovo...");
            audioTracks.forEach(track => track.stop());
          } else {
            console.log(" Nessuna traccia audio - perfetto!");
          }
          // Crea elemento video p5.js dallo stream
          video = createCapture(VIDEO);
          video.elt.srcObject = stream;
          video.size(640, 480);
          video.hide();
          console.log("Video pronto!");

          // Inizializza handPose DOPO che il video è pronto
          handPose = ml5.handPose(video, function() {
            console.log(' HandPose model loaded!');
            modelReady = true;
            handPose.detectStart(video, gotHands);
            console.log(" Detection avviata");
          });
        })
        .catch(function(err) {
          console.error("Errore nell'accesso alla telecamera:", err);
          alert("Impossibile accedere alla telecamera. Assicurati di dare i permessi necessari.");
        });
    })
    .catch(function(err) {
      console.error("Errore nell'enumerazione dei dispositivi:", err);
    });
}


function draw() {
  // SCHEMA 0: Schermata iniziale
  if (schema === 0) {
    background(start);
    // Avvia musica di sottofondo
    if (musicaBG && !musicaBG.isPlaying()) {
      musicaBG.setVolume(0.4);
      musicaBG.loop();
    } 
    return;
  }
  // SCHEMA 1: Menu selezione modalità
  if (schema === 1) {
    background(back);
    // Titolo
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(60);
    text("SCEGLI COME GIOCARE", width / 2, height / 2 - 200);
    // Bottone MANO
    let hoverMano = mouseX > bottoneMano.x && mouseX < bottoneMano.x + bottoneMano.w &&
                     mouseY > bottoneMano.y && mouseY < bottoneMano.y + bottoneMano.h;
    // Disegna bottone
    if (hoverMano) {
      fill(100, 200, 100); // Verde chiaro hover
      stroke(255);
      strokeWeight(4);
    } else {
      fill(50, 150, 50); // Verde normale
      stroke(200);
      strokeWeight(2);
    }
    rect(bottoneMano.x, bottoneMano.y, bottoneMano.w, bottoneMano.h, 20);
    // Testo bottone
    fill(255);
    noStroke();
    textSize(40);
    text(" MANO", bottoneMano.x + bottoneMano.w / 2, bottoneMano.y + bottoneMano.h / 2);
    // Istruzioni
    textSize(20);
    fill(200);
    text("Clicca per giocare con i gesti della mano", width / 2, height / 2 + 100);
    textAlign(LEFT);
    return;
  }

  // SCHEMA 2: Gioco attivo
  if (schema === 2) {
    background(back);
    // VIDEO DEBUG SEMPRE VISIBILE in alto a destra (solo se modalità mano)
    if (modalitaGioco === "mano" && video && video.loadedmetadata) {
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

    noTint();
    fill(255);
    textSize(42);
    textAlign(LEFT);
    text("Punteggio: " + punteggio, 50, 50);
    text("Livello: " + livello, 800, 50);
    
    // Mostra modalità
    textSize(24);
    fill(200);
    text("Modalità: " + (modalitaGioco === "mano" ? " MANO" : " MOUSE"), 50, 100);

    // Talpa
    if (talpa && talpa.visibile) {
      talpa.show();
      talpa.fadeOut();
      
      // AVVISO: Se c'è la talpa, blocca le carte
      fill(255, 255, 0);
      textSize(32);
      textAlign(CENTER);
      text(" PRENDI LA TALPA PRIMA! ", width / 2, height - 50);
      textAlign(LEFT);
    }

    // Controllo pizzico per click gesturale (solo se modalità mano)
    if (modalitaGioco === "mano" && hands.length > 0) {
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

    // Debug: mostra hand tracking (solo se modalità mano)
    if (modalitaGioco === "mano") {
      mostraHandTracking();
    }
  }

  // SCHEMA 3: Schermata vittoria
  if (schema === 3) {
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
  textAlign(LEFT);
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
    carte.push(new Carta(500, 100, imgC, 68, imgc15));
    carte.push(new Carta(700, 100, imgC, 13, imgc13 ));
    carte.push(new Carta(900, 100, imgC, 5, imgc5));
    carte.push(new Carta(1100, 100, imgC, 60, imgc12 ));
    carte.push(new Carta(400, 350, imgC, 5, imgc6));
    carte.push(new Carta(600, 350, imgC, 68, imgc16 ));
    carte.push(new Carta(800, 350, imgC, 13, imgc14 ));
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
      schema = 3;
      coriandoli = [];
      for (let i = 0; i < numCoriandoli; i++) {
        coriandoli.push(new Coriandolo());
      }
    }
  }
}

function mouseClicked() {
  // SCHEMA 0: Avvia dal start al menu
  if (schema === 0) {
    schema = 1;
    return;
  }

  // SCHEMA 1: Selezione modalità nel menu
  if (schema === 1) {
    // Click su bottone MANO
    if (mouseX > bottoneMano.x && mouseX < bottoneMano.x + bottoneMano.w &&
        mouseY > bottoneMano.y && mouseY < bottoneMano.y + bottoneMano.h) {
      modalitaGioco = "mano";
      schema = 2; // Passa al gioco
      console.log("✅ Modalità MANO selezionata");
      return;
    }
    return;
  }

  // SCHEMA 2: Gioco attivo (solo se modalità mouse - per ora non usato)
  if (schema === 2) {
    if (bloccaClick) return;

    // Click sulla talpa (SOLO se esiste E se è visibile)
    if (talpa && talpa.visibile && talpa.isMouseOver(mouseX, mouseY)) {
      talpa.preso(imgTalpaHit);
      punteggio += 2;
      return;
    }

    // Se c'è la talpa visibile, blocca i click sulle carte
    if (talpa && talpa.visibile) {
      return;
    }

    // Click sulle carte (se NON c'è la talpa o non è visibile)
    // NOTA: Questo funziona solo se modalità è diversa da "mano"
    // Per ora con modalità mano, si usa solo handClick()
    if (modalitaGioco !== "mano") {
      for (let n of carte) {
        if (n.isMouseOver(mouseX, mouseY) && !n.trovata && !n.girata && n !== primaCarta && n.imgShow === imgC) {
          n.flip();
          if (musicaFlip) {
            musicaFlip.play();
          }

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
  }
}

function handClick() {
  if (bloccaClick) return;

  let mx = handX;
  let my = handY;

  // Click sulla talpa (SOLO se esiste E se è visibile)
  if (talpa && talpa.visibile && talpa.isMouseOver(mx, my)) {
    talpa.preso(imgTalpaHit);
    punteggio += 2;
    return;
  }

  // Se c'è la talpa visibile, blocca i click sulle carte
  if (talpa && talpa.visibile) {
    return;
  }

  // Click sulle carte (se NON c'è la talpa o non è visibile)
  for (let n of carte) {
    if (n.isMouseOver(mx, my) && !n.trovata && !n.girata && n !== primaCarta && n.imgShow === imgC) {
      n.flip();
      if (musicaFlip) {
        musicaFlip.play();
      }

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







    
