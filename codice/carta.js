class Carta {
  constructor(x, y, img,val) {
    this.x = x;
    this.y = y;
    this.imgShow = img;
    this.val=val;
  }

  isMouseOver() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.imgShow.width &&
      mouseY > this.y &&
      mouseY < this.y + this.imgShow.height
    );
  }

  flip(nuovaImg) {
    this.imgShow = nuovaImg;
  }
}
