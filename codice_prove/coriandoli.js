class Coriandolo {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.size = random(5, 15);
    this.speed = random(2, 6);
    this.angle = random(TWO_PI);
    this.angularSpeed = random(-0.1, 0.1);
    this.col = color(random(255), random(255), random(255));
  }

  update() {
    this.y += this.speed;
    this.angle += this.angularSpeed;
    if (this.y > height) {
      this.y = random(-50, -10);
      this.x = random(width);
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    fill(this.col);
    rectMode(CENTER);
    rect(0, 0, this.size, this.size * 0.4); // rettangolo piccolo come coriandolo
    pop();
  }
}
