let points = [];
const string = "Welcome to Heaven";

function setup() {
  createCanvas(600, 400);
  textSize(32);
  textAlign(CENTER)
  textFont("courier")
  fill(200)
  for (let i = 0; i < string.length; i++) {
    let char = string.charAt(i);
    let x = width/2 - textWidth(string)/2 + i * 20;
    let y = height/2;
    
    // Create a new Point object for each character and add it to the list
    points.push(new Point(char, x, y));
  }
}

function draw() {
  background(50);
  let mou = createVector(mouseX,mouseY);
  for (let point of points) {
    point.update(mou);
    point.display();
  }
}
