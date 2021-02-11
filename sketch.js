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

function keyPressed(){
  if(keyCode == UP_ARROW){
    car.gear++;
    if(car.gear > 5) car.gear = 5;
  }
  else if(keyCode == DOWN_ARROW){
    car.gear--;
    if(car.gear < 0) car.gear = 0;
  }
}