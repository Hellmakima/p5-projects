// Define the Point class
class Point {
  constructor(char, x, y) {
    this.char = char;
    this.pos = createVector(x, y);  // Current Position vector
    this.org = createVector(x, y);  // Original Position vector
    this.vel = createVector();      // Velocity vector
    this.acc = createVector();      // Acceleration vector
  }
  
  // Update the point's position based on velocity and acceleration
  update(m) {
    let d = this.pos.dist(m);
    
    // If within the repulsion distance, apply repulsion force
    if (d < 100) {
      let direction = p5.Vector.sub(this.pos, m);
      direction.normalize();
      direction.mult(0.1); // Control the strength of repulsion
      this.acc = direction;
    } else {
      // If not within the repulsion distance, no repulsion force
      this.acc.mult(0);
    }
    
    // Apply the repulsion acceleration to velocity and position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Move towards the original position
    let returnDirection = p5.Vector.sub(this.org, this.pos);
    returnDirection.normalize();
    returnDirection.mult(0.05); // Control the strength of the attraction to the original position
    this.acc = returnDirection;
    
    // Apply the attraction acceleration to velocity and position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Apply damping to velocity
    this.vel.mult(0.9);
  }
  
  // Display the point as a character
  display() {
    text(this.char, this.pos.x, this.pos.y);
  }
}
