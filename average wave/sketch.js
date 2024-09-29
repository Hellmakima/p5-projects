class SineWave {
  constructor(amplitude, frequency, phase, color) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
    this.color = color;
  }

  draw(xOffset) {
    stroke(this.color);
    noFill();
    beginShape();
    for (let x = 0; x < width; x++) {
      let angle = map(x + xOffset, 0, width, 0, TWO_PI * this.frequency);
      let y = height / 3 + this.amplitude * sin(angle + this.phase) * 0.4;
      vertex(x, y);
    }
    endShape();
  }

  getY(x) {
    let angle = map(x, 0, width, 0, TWO_PI * this.frequency);
    return height / 2 + this.amplitude * sin(angle + this.phase);
  }
}

let waves = [];
let sliders = [];
let sliderLabels = ['Amplitude', 'Frequency', 'Phase'];

function setup() {
  createCanvas(800, 800);

  // Create sliders for each wave
  for (let i = 0; i < 3; i++) {
    let amplitudeSlider = createSlider(0, 100, 50);
    amplitudeSlider.position(10, 30 + i * 60);
    amplitudeSlider.size(80);
    sliders.push({ amplitude: amplitudeSlider });

    let frequencySlider = createSlider(1, 1000, 200);
    frequencySlider.position(100, 30 + i * 60);
    frequencySlider.size(80);
    sliders.push({ frequency: frequencySlider });

    let phaseSlider = createSlider(-PI, PI, 0, 0.01);
    phaseSlider.position(190, 30 + i * 60);
    phaseSlider.size(80);
    sliders.push({ phase: phaseSlider });

    waves.push(new SineWave(
      amplitudeSlider.value(),
      frequencySlider.value() / 100,
      phaseSlider.value(),
      color(random(255), random(255), random(255))
    ));
  }
}

function draw() {
  background(220);
  
  // Draw each wave
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];
    wave.amplitude = sliders[i * 3].amplitude.value();
    wave.frequency = sliders[i * 3 + 1].frequency.value() / 100;
    wave.phase = sliders[i * 3 + 2].phase.value();
    wave.draw(0); // Draw wave at xOffset 0
  }
  
  // Draw cumulative wave
  stroke(0);
  noFill();
  beginShape();
  for (let x = 0; x < width; x++) {
    let cumulativeY = 0;
    for (let wave of waves) {
      cumulativeY += wave.getY(x);
    }
    vertex(x, cumulativeY / waves.length); // Average out the cumulative wave
  }
  endShape();
  
  // Draw sliders' labels
  noStroke();
  fill(0);
  textSize(12);
  for (let i = 0; i < 3; i++) {
    text(sliderLabels[0], 10, 20 + i * 60);
    text(sliderLabels[1], 100, 20 + i * 60);
    text(sliderLabels[2], 190, 20 + i * 60);
  }
}
