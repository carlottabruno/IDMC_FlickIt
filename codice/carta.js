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

  isMouseOver() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.imgShow.width &&
      mouseY > this.y &&
      mouseY < this.y + this.imgShow.height
    );
  }

 flip() {
  if (!this.girata) {
    this.imgShow = this.next; // gira la carta
    this.girata = true;       // segna come girata
  } else {
    this.imgShow = this.img;  // rigira sul retro se vuoi
    this.girata = false;
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

