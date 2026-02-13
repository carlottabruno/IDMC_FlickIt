class Talpa {
  constructor(img) {
    this.imgNormale = img;
    this.imgShow = img;

    this.x = random(width - 100);
    this.y = random(height - 100);

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

  isMouseOver() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.imgShow.width &&
      mouseY > this.y &&
      mouseY < this.y + this.imgShow.height
    );
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
