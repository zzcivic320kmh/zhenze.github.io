let yourImage;

function preload(){
    yourImage = loadImage('images.png');
}

let shape1y = 457; 		//y position
let shape1r = -4.8;		//rotation

let shape2y = 343;
let shape2r = 5.76;

let shape3y = 257; 
let shape3r = -9.6;

let bally = 169; 

let c1, c2, c3, cb; 						//colour of the ball and shapes
let s1w, s1h, s2w, s2h, s3w, s3h, bw, bh; 	//dimensions of the ball and shapes
let tH = 215 								// total height used in style 4

let speed = -0.5;
let accel = 0.05;
let acceltemp = 0;
let acceldecay = 0.04;
let rotation = 1;

let s1rm, s2rm, s3rm; 				//shape (number) rotation multiplier (for styles)
let s1mm, s2mm, s3mm, cmm;			// shape (number) and ball movement multiplier
let style1, style2, style3, style4;	// to change the shapes

let temp1w, temp2w, temp3w;		// temporary variables for transition to style 3
let temp1h, temp2h, temp3h;

let tcheck1 = false;			// transition checks
let tcheck2 = true;
let timetemp;

let bounced = false;			// to check if shapes have bounced

function setup() {
	createCanvas(800, 600);
	rectMode(CENTER);
	angleMode(DEGREES);
	styleSwap(1);				// sets initial style
	
}

function draw() {	// primarily draws shapes | variables in animate()
	background(247, 249, 245);

    image(yourImage, 0, 0,300,300);
	
	animate();					// constantly changing variables
	
	//shape 2 middle (drawn first to make horizontally sliced circles)
	push();
	translate(width/2 , shape2y);	// translated so shapes rotate around the center
	rotate(shape2r);
	
	if (style3 == true) {
		invertFill(c2);			//custom function
		trapezium(0, 0, s2w, s1w, s2h);
	}
	
	else if (style4 == true) {
		sFill(c2);
		push();
		rotate(-166);
		ellipse(0, 0, 175);
		pop();
		push();
		fill(247, 249, 245);
		rect(0, -120, 200, 100);	// rectangles that cover part of the circle
		rect(0, 75, 200, 100 );
		pop();
	}
	else {	// when style 1 or 2
		sFill(c2);
		rect(0, 0 ,s2w, s2h);
	}
	
	pop();
	
	//shape 1 bottom
	push();
	translate(width/2, shape1y);
	rotate(shape1r);
	
	if (style3 == true) {
		sFill(c1);
		trapezium(0, 0, s1w, 0, s1h);
	}
	
	else if (style4 == true) {
		sFill(c1);
		arc(0, -60 , 175, 175, 20, 160, open);	//creates top segment
		
	}
	
	else {
		invertFill(c1);
		rect(0, 0 ,s1w, s1h);
	}
	pop();
	
	//shape 3 top
	push();
	translate(width/2 , shape3y);
	rotate(shape3r);
	
	if (style3 == true) {
		sFill(c3);
		trapezium(0, 0, s3w, s2w, s3h);
	}
	
	else if (style4 == true) {
		sFill(c3);
		arc(0, 50, 180, 180, 235, 305, open);	//creates bottom segment
	}
	
	else {
	sFill(c3);
	rect(0, 0 ,s3w, s3h);
	}
	pop();
	
	//ball
	push();
	translate(width/2, bally);
	
	sFill(cb);
	
	ellipse(0, -(speed*speed), bw, bh * (1 + speed*speed/15)); // calculations to make ball strecth according to speed
	
	pop();
}

function trapezium(x, y, topWidth, bottomWidth, height) { // to draw trapeziums from center simplified
	beginShape();
	vertex(x - topWidth/2 ,y - height/2);
	vertex(x + topWidth/2 , y - height/2);
	vertex(x + bottomWidth/2 , y + height/2);
	vertex(x - bottomWidth/2 ,y + height/2);
	endShape(CLOSE);
}

function invertFill(colour) { 	// to simplify
	noFill();
	stroke(colour);
	strokeWeight(5);
}

function sFill(colour) { 		// to simplify
	noStroke();
	fill(colour);
}

function animate() {			// changing variables calculated here
	// movement
	if (acceltemp <= 0) {acceltemp = 0}
	else if (acceltemp > 0) {acceltemp -= acceldecay}
	speed += accel + acceltemp;
	if (speed <= 0) {speed -= speed * 0.035}	// friction
	if (bally <= 150) {speed -= speed * 0.05}	// added conditional friction so ball does not gain too much speed
	else if (bally <= 50) {speed -= speed * 0.1}// added conditional friction so ball does not gain too much speed
	
	if (tcheck1 == true) {transition(15)} // to style 3;
	
	
	temp = speed		 // simplify
	shape1y += temp * s1mm;
	shape2y += temp * s2mm;
	shape3y += temp * s3mm;
	bally += temp * bmm;
	
	// rotation
	temp = rotation;	 // simplify
	shape1r += temp * s1rm;
	shape2r += temp * s2rm;
	shape3r += temp * s3rm;
	
	// if collide
	if (shape3y - bally <= 40) {

		bounce();
		
		shape1r = 0;
		shape2r = 0;
		shape3r = 0;

		speed -= accel // fixes issue where ball slows down on bounce
	}
	
	if (speed <= 0.025 && speed >= -0.025) {	// apex of bounce
		rotation *= -1;
		bounced = false;
		if (style2 == true) {
			tcheck1 = true;		//	allows transition
		}
	}
		
	
	else if (speed >= 0.03) {	//adds boost
		if (tcheck1 != true) {acceltemp = 0.5}	//to check if slowed down for transition
		}
	
}

function bounce() {				// code when shapes collide to bounce
	if (bounced == false) {
	speed *= -1;
	
	bounced = true;
	
		if (style1 == true) {
		styleSwap(2);
		}
		else if (style3 == true) {
		styleSwap(4);
		}
		else if (style4 == true) {
		styleSwap(1);
		}
	}
}

function transition(time) {		// to transition to style 3
	temp = 15;					// temporary value to slow down and speed back up
	timetemp -= 1;
	if (tcheck2 == true) {	// runs once when function is called
		
		timetemp = time;	// temporary value for time
		
		speed /= temp;		// slows down
		accel /= temp;
		acceltemp /= temp;
		acceldecay /= temp;
		rotation /= temp;
		
		s1we = 100;			// shape (number) width end value
		s1he = 90;			// shape (number) height end value
		
		s2we = 165;
		s2he = 70;
		
		s3we = 180;
		s3he = 15;
		
		temp1w = s1w/time;	//temporary values to shrink evenly
		temp2w = s2w/time;
		temp3w = s3w/time;
		
		temp1h = s1h/time;
		temp2h = s2h/time;
		temp3h = s3h/time;
		
		rotation *= -1;
		
		tcheck2 = false;
	}
	
	if (timetemp < -time) {	// speeds up and stops function
		speed *= temp;
		accel *= temp;
		acceltemp *= temp;
		acceldecay *= temp;
		rotation *= temp;
		
		tcheck1 = false;
		tcheck2 = true;
	}
	
	else if (timetemp > 0) {
		
		s1w -= temp1w;
		s2w -= temp2w;
		s3w -= temp3w;

		s1h -= temp1h;
		s2h -= temp2h;
		s3h -= temp3h;
	}
	
	else if (timetemp <= 0) {
		styleSwap(3);
		
		s1w += s1we/time;
		s2w += s2we/time;
		s3w += s3we/time;
		
		s1h += s1he/time;
		s2h += s2he/time;
		s3h += s3he/time;
	}
}

function styleSwap(style) {		// to swap styles
	if (style == 1) {
		s1rm = -0.1;
		s2rm = 0.12;
		s3rm = -0.2;
		
		s1mm = 1;
		s2mm = 2;
		s3mm = 3;
		bmm = 4;
		
		c1 = '#F97A10';
		c2 = '#0A466E';
		c3 = '#F94E58';
		cb = '#7EC1C7';
		
		s1w = 175;
		s1h = 100;
		
		s2w = 180;
		s2h = 25;
		
		s3w = 180;
		s3h = 50;
		
		bw = 30;
		bh = 30;
		
		style4 = false;
		style1 = true;
	}
	
	else if (style == 2) {
		
		s1rm = -0.1;
		s2rm = 0.12;
		s3rm = -0.2;
		
		s1mm = 1;
		s2mm = 2;
		s3mm = 3;
		bmm = 4;
		
		c1 = '#F94E58';
		c2 = '#0A466E';
		c3 = '#7EC1C7';
		cb = '#003646';
		
		s1w = 175;
		s1h = 100;
		
		s2w = 180;
		s2h = 25;
		
		s3w = 180;
		s3h = 50;
		
		bw = 30;
		bh = 30;
	
		style1 = false;
		style2 = true;
	}
	
	else if (style == 3) {
		c1 = '#0579A3';
		c3 = '#F97A10';
		
		style2 = false;
		style3 = true;
	}
	
	else if (style == 4) {
		s1rm = 0.2;
		s2rm = -0.2;
		s3rm = 0.2;
		
		s1mm = 0;
		shape1y = 509;
		
		s1mm = 1;
		s2mm = 2;
		s3mm = 3;
		bmm = 4;
		
		c2 = '#003646';
		cb = '#F94E58';
		
		s1w = 175;
		s1h = 100;
		
		s2w = 180;
		s2h = 25;
		
		bw = 30;
		bh = 30;
		
		temp = 180;
		s1w = temp;
		s2w = temp;
		s3w = temp;
		
		s3h = 45

		
		tH = s1h + s2h + s3h; // total height
		
		style3 = false;
		style4 = true;
	}
}