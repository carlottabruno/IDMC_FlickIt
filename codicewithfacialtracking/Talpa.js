class Talpa{
  constructor(img) {
    this.imgNormale = img;//immagine di cambio quando la talpa viene colpito 
    this.imgShow = img;

    this.x = random(width - 700);
    this.y = random(height - 700);

    this.alpha = 255;//variabile di trasparenza
    this.visibile = true;
    this.presa = false;
    this.musicaTalpa();
    
  }
  musicaTalpa(){//musica talpa quando esce 
    if (talpaSound && talpaSound.isLoaded()) {
    talpaSound.play();
    }
  }
  musicaTalpaout(){//musica della talpa quando viene presa
    if(talpaSoundslap && talpaSoundslap.isLoaded()){
      talpaSoundslap.play();
    }
  }
  show() {
    if (!this.visibile) return;
    tint(255, this.alpha);
    image(this.imgShow, this.x, this.y);
    noTint();
  }
  isMouseOver(mx, my) {
    // Area più grande per facilitare il click
    let margine = 500; // pixel di tolleranza
    return mx > this.x - margine && mx < this.x + 100 + margine &&
          my > this.y - margine && my < this.y + 100 + margine;
  }
  preso(imgHit) {
    this.imgShow = imgHit;
    this.presa = true;
    this.musicaTalpaout();
  }
  fadeOut() {//funzione per far scomparire la talpa con un effetto trasparenza 
    if (this.presa) {
      this.alpha -= 10;
      if (this.alpha <= 0) {
        this.visibile = false;
      }
    }
  }
}
