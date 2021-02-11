let car

const airDensity = 1.29; // kg/m^3

function setup() {
  createCanvas(windowWidth, windowHeight);

  car = new Vehicle();
}

function draw() {
  background(220);

  if(keyIsDown(83)) // S key
    car.brake();
  else
    car.stopBrake();

  if(keyIsDown(87)) // W key
    car.accelerate();
  else 
    car.stopAccelerate();

  car.update();
  car.draw();
}