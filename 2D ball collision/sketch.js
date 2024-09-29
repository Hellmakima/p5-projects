class P {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 2));
    this.acc = createVector(0, 0);
    this.mass = random(0.1, 0.2);
    this.r = sqrt(this.mass) * 20;
    this.damping = 0.92; // Damping factor for collision energy loss
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.add(0, 0.1);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  collide(o) {
    let impactVector = p5.Vector.sub(o.pos, this.pos);
    let d = impactVector.mag();
    if (d < this.r + o.r) {
      
      // Push the particles out so that they are not overlapping
      let overlap = d - (this.r + o.r);
      let dir = impactVector.copy();
      dir.setMag(overlap * 0.5);
      this.pos.add(dir);
      o.pos.sub(dir);
      
      // Correct the distance!
      d = this.r + o.r;
      impactVector.setMag(d);
      
      let mSum = this.mass + o.mass;
      let vDiff = p5.Vector.sub(o.vel, this.vel);
      
      // Particle A (this)
      let num = vDiff.dot(impactVector);
      let den = mSum * d * d;
      let deltaVA = impactVector.copy();
      deltaVA.mult(2 * o.mass * num / den);
      this.vel.add(deltaVA);
      
      // Particle B (o)
      let deltaVB = impactVector.copy();
      deltaVB.mult(-2 * this.mass * num / den);
      o.vel.add(deltaVB);

      // Apply damping to reduce the velocity after collision
      this.vel.mult(this.damping);
      o.vel.mult(this.damping);
    }
  }

  edges() {
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }

  show() {
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

let objects = [];
let mousePoint = null;
function setup() {
  createCanvas(640, 360);
  for (let i = 0; i < 300; i++) {
    objects.push(new P(random(width), random(height)));
  }
  mousePoint = new P(width / 2, height / 2);
  mousePoint.r = 20; // Make mousePoint larger
}

function draw() {
  background(50);
  
  // Move mousePoint towards mouse position
  let mouseVector = createVector(mouseX, mouseY);
  let dir = p5.Vector.sub(mouseVector, mousePoint.pos);
  if (dir.mag() > 0) {
    dir.normalize(); // Normalize the direction vector
    dir.mult(10); // Set the speed (you can adjust this value)
    mousePoint.vel = dir; // Update velocity
  }

  // Update and display the mouse point
  mousePoint.update();
  mousePoint.edges();
  mousePoint.show();

  for (let obj of objects) {
    obj.update();
    obj.edges();
    obj.show();
    for (let o2 of objects) {
      if (obj === o2) continue;
      obj.collide(o2);
    }
    
    // Check for collision with the mouse point
    obj.collide(mousePoint);
  }
}
