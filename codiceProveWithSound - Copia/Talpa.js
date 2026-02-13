class Talpa {
  constructor(img) {
    this.imgNormale = img;
    this.imgShow = img;

    this.x = random(width - 600);
    this.y = random(height - 600);

    this.alpha = 255;
    this.visibile = true;
    this.presa = false;
  }

  show() {
    if (!this.visibile) return;
    tint(255, this.alpha);
    image(this.imgShow, this.x, this.y);
    noTint();
  }

isMouseOver(mx, my) {
    // Area ingrandita con margine extra
    let margine = 500; // pixel di tolleranza (aumenta questo per area più grande)
    return mx > this.x - margine && 
           mx < this.x + 100 + margine &&
           my > this.y - margine && 
           my < this.y + 100 + margine;
  }

  preso(imgHit) {
    this.imgShow = imgHit;
    this.presa = true;
  }

  fadeOut() {
    if (this.presa) {
      this.alpha -= 10;
      if (this.alpha <= 0) {
        this.visibile = false;
      }
    }
  }
}
