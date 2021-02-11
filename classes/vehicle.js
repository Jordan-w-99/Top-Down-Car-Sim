class Vehicle {
    constructor() {
        this.RPM = 1000;
        this.gear = 0;
        this.braking = false;
        this.throttlePosition = 0;
        this.wheelAngularAcceleration = 0;
        this.wheelAngularVel = 0;
        this.driveTorque = 0;
        this.tractionF = 0;
        this.rollResF = 0;
        
        // Constants
        this.frontalArea = 2.2; // m^2
        this.frictionCoeff = 0.30;
        this.dragCoeff = 0.5 * this.frictionCoeff * this.frontalArea * airDensity;
        console.log(this.dragCoeff)
        this.rrCoeff = this.dragCoeff * 30;
        this.mass = 1500;
        this.brakingCoeff = 0.5;
        this.torqueCurve = { // in Nm
            "1000": 400,
            "2000": 430,
            "3000": 450,
            "4000": 475,
            "5000": 465,
            "6000": 400,
        };
        this.gearRatios = [
            2.66,
            1.78,
            1.30,
            1,
            0.74,
            0.5,
            2.9
        ];
        this.diffRatio = 3.42;
        this.transEfficiency = 0.7;
        this.wheelRadius = 0.34;

        // Vectors
        this.pos = createVector(20, height / 2);
        this.vel = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.heading = createVector(1, 0);
        this.longForce = createVector(0, 0);
        this.brakingF = createVector(0,0);
    }

    update(){
        this.brakingF = this.calculateBrakingForce();
        this.rollResF = this.calculateRollingResistance();
        this.tractionF = this.calculateTractionForce();
        this.wheelAngularAcceleration = this.calculateWheelAngularAcceleration();
        this.wheelAngularVel = this.calculateWheelAngularVel();
        this.RPM = this.calculateRPM();
        this.driveTorque = this.calculateDriveTorque();
        this.longForce = this.calculateLongForce();
        this.acceleration = this.calculateAcceleration();
        this.vel = this.calculateVelocity();
        this.pos = this.calculatePosition();
    }

    draw(){
        push();
        translate(this.pos.x, this.pos.y);
        rotate(createVector(0,0).angleBetween(this.heading));

        fill(0);
        rect(0, 0, 30, 15);

        pop();
    }

    calculateRPM(){
        const RPM = 17 * this.gearRatios[this.gear] * this.diffRatio * 60 / TWO_PI;
        return RPM;
    }

    calculateMaxTorque(){
        const lowerRPM = int(this.RPM / 1000) * 1000;
        const higherRPM = (int(this.RPM / 1000) + 1) * 1000;
        const rangePercent = (this.RPM / lowerRPM) - 1;

        const torque = lerp(this.torqueCurve[lowerRPM], this.torqueCurve[higherRPM], rangePercent);
        return torque;
    }

    calculateBrakingForce(){
        const brakingF = createVector(-this.heading.x * this.brakingCoeff, -this.heading.y * this.brakingCoeff);
        return this.braking === true ? brakingF : createVector(0,0);
    }

    calculateDriveTorque(){
        const engineTorque = this.calculateMaxTorque() * this.throttlePosition;
        const driveTorque = engineTorque * this.gearRatios[this.gear] * this.diffRatio * this.transEfficiency / this.wheelRadius;
        return driveTorque;
    }

    calculateTractionForce(){
        // Forward Force
        const driveF = createVector(this.heading.x * this.driveTorque, this.heading.y * this.driveTorque);
        const tractionF = createVector(this.heading.x * driveF.x, this.heading.y * driveF.y) // Ftraction = U * engineforce
        return tractionF;
    }

    calculateRollingResistance(){
        const rrF = createVector(this.vel.x * - this.rrCoeff, this.vel.y * - this.rrCoeff);
        return rrF;
    }

    calculateLongForce() {
        // Backward Forces
        const dragF = createVector(this.vel.x * this.dragCoeff, this.vel.y * this.dragCoeff);

        // Total Force
        const primaryF = this.braking === true ? this.brakingF : this.tractionF; // Check if we're braking
        const longForce = createVector(primaryF.x + dragF.x + this.rollResF.x, primaryF.y + dragF.y + this.rollResF.y)

        return longForce;
    }

    calculateAcceleration() {
        const acceleration = createVector(this.longForce.x / this.mass, this.longForce.y / this.mass);
        return acceleration;
    }

    calculateVelocity(){
        const velMult = createVector(this.acceleration.x * deltaTime, this.acceleration.y * deltaTime);
        const vel = createVector(this.vel.x + velMult.x, this.vel.y + velMult.y);
        return vel;
    }

    calculatePosition(){
        const posMult = createVector(this.vel.x * deltaTime, this.vel.y * deltaTime);
        const position = createVector(this.pos.x + posMult.x / 1000, this.pos.y + posMult.y / 1000);
        return position;
    }

    calculateWheelAngularAcceleration(){
        const wheelAngularAcceleration = (this.driveTorque - this.brakingF.mag() - this.rollResF.mag()) / 1000;

        return wheelAngularAcceleration ? wheelAngularAcceleration : 0;
    }

    calculateWheelAngularVel(){
        const wheelAngularVel = this.wheelAngularVel + this.wheelAngularAcceleration * deltaTime;
        console.log(this.wheelAngularAcceleration);
        return wheelAngularVel;
    }

    accelerate(){
        this.throttlePosition = lerp(this.throttlePosition, 1, 0.2);
    }

    stopAccelerate(){
        this.throttlePosition = lerp(this.throttlePosition, 0, 0.05);
    }

    brake(){
        this.braking = true;
        this.throttlePosition = lerp(this.throttlePosition, 0, 0.05);
    }

    stopBrake(){
        this.braking = false;
    }
}