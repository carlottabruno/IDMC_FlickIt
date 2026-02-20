class Carta {
  constructor(x, y, img, val,next) {
    this.x = x;
    this.y = y;
    this.imgShow = img;//imgshow variabile che mostra la carta 
    this.img=img;//due varibili di immagine per il flip della carta 
    this.val = val;//valore per mathcare le carte 
    this.trovata = false;
    this.alpha = 255;       // opacità attuale per il fade 
    this.daRimuovere = false; // se deve iniziare a sparire
    this.pauseTimer = 0;  
    this.next=next ;
    this.girata=false;  // conta i frame prima di iniziare la sfumatura
  }

  isMouseOver(px = mouseX, py = mouseY) {
  return px > this.x && px < this.x + this.imgShow.width &&
         py > this.y && py < this.y + this.imgShow.height;
}

flip() {//serve per girare la carta 
  if (musicaFlip && musicaFlip.isLoaded()) {
    musicaFlip.play();
  }
  if (!this.girata) {
    this.imgShow = this.next;//next immagine girata 
    this.girata = true;
  } else {
    this.imgShow = this.img;
    this.girata = false;
  }
}
  fadeOut() {//funzione per far scoparire  
    if (this.pauseTimer > 0) {
      this.pauseTimer--; // aspetta
      return;
    }
    if (this.alpha > 0) {
      this.alpha -= 10; // diminuisci alpha più lentamente
      if (this.alpha < 0) this.alpha = 0;
    } else {
      this.trovata = true;
      this.daRimuovere = false;
    }
  }
}

