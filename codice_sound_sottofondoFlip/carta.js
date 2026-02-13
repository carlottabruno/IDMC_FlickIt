class Carta {
  constructor(x, y, img, val,next) {
    this.x = x;
    this.y = y;
    this.imgShow = img;
    this.img=img;
    this.val = val;
    this.trovata = false;
    this.alpha = 255;       // opacità attuale
    this.daRimuovere = false; // se deve iniziare a sparire
    this.pauseTimer = 0;  
    this.next=next ;
    this.girata=false;  // conta i frame prima di iniziare la sfumatura
  }

  isMouseOver(px = mouseX, py = mouseY) {
  return px > this.x && px < this.x + this.imgShow.width &&
         py > this.y && py < this.y + this.imgShow.height;
}


flip() {

  if (musicaFlip && musicaFlip.isLoaded()) {
    musicaFlip.play();
  }

  if (!this.girata) {
<<<<<<< HEAD
<<<<<<< HEAD:codice_sound/carta.js
    this.imgShow = this.next; // gira la carta
    this.girata = true;       // segna come girata
    if(carteSound) carteSound.play()
=======
    this.imgShow = this.next;
    this.girata = true;
>>>>>>> 842fbbd9a4496ced04f4b1af8863e0a0157d3841:codice_sound_sottofondoFlip/carta.js
=======
    this.imgShow = this.next;
    this.girata = true;
>>>>>>> 842fbbd9a4496ced04f4b1af8863e0a0157d3841
  } else {
    this.imgShow = this.img;
    this.girata = false;
    if(carteSound) carteSound.play()
  }
}


  fadeOut() {
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

