var canvasWidth = 512;
var canvasHeight = 512;

var lowerSlider, upperSlider
var lowerSliderVal, upperSliderVal

var images = [];
var currentSlice = 0;
var numSlices = 11;
var top = 0
var left = 0;

var button;

function setup() {
	canvas = createCanvas(canvasWidth,canvasHeight)
 
	lowerSlider = createSlider(0, 255, 100);
	lowerSlider.position(20, 320);
	upperSlider = createSlider(0, 255, 100);
	upperSlider.position(20, 350);

	lowerSlider.mousePressed(updateSlider);
	upperSlider.mousePressed(updateSlider);

	button = createButton('play');

	currentSlice = 0;
	top = 0;
	left = 0;
	//canvas.mouseWheel(canvas_mousewheel, event);
 
}

function updateSlider() {
	//print(lowerSliderVal);
	lowerSliderVal = lowerSlider.value();
	upperSliderVal = upperSlider.value();
	myDrawImage();
}

//a predefined p5 function, like draw()
function preload() {
	//myLoadImage();
	images[currentSlice] = loadImage("images/Untitled_" + currentSlice + ".png");  // Load the image
	myDrawImage();
}

function myLoadImage() {
  	if (images[currentSlice] == null) {
  		images[currentSlice] = loadImage("images/Untitled_" + currentSlice + ".png", myDrawImage);  // Load the image
	}
}

function myDrawImage() {
	//myTest();
	if (1) {
		images[currentSlice].loadPixels();
		var pink = color(0, 0, 0, lowerSliderVal);
		var d = 1;
		var halfImage = 4 * (width * d) * (height/2 * d);
		//print(halfImage);
		for (var i = 0; i < halfImage; i+=4) {
		  images[currentSlice].pixels[i] = red(pink);
		  images[currentSlice].pixels[i+1] = green(pink);
		  images[currentSlice].pixels[i+2] = blue(pink);
		  images[currentSlice].pixels[i+3] = alpha(pink);
		}
		images[currentSlice].updatePixels();
	}
	//image(images[currentSlice], left, top);
	image(images[currentSlice]);
}

//built in
function draw() {
	lowerSliderVal = lowerSlider.value();
	upperSliderVal = upperSlider.value();
	//canvas.background(lowerSliderVal, upperSliderVal, 93);	
}

function mouseisincanvas() {
	return (mouseX>0 && mouseX<canvasWidth);
}

function nextSlice(direction) {
	currentSlice -= direction;
	if (currentSlice<0) { currentSlice=0; }
	else if (currentSlice>numSlices-1) { currentSlice = numSlices-1; }
	myLoadImage();
	//image(images[currentSlice], left, top);
	image(images[currentSlice]);
	print("currentSlice:" + currentSlice + " width:" + width + " height:" + height);
}

function mouseWheel(event) {
  if (mouseisincanvas()) {
		nextSlice(event.delta);
		return false; //blocks page scrolling
	} else {
		return true //allow page scrolling
	}
}

function keyTyped() {
  print(key);
  if (key === '+') {
    print('+ ' + mouseX + ' ' + mouseY);
  } else if (key === '-') {
    print('- ' + mouseX + ' ' + mouseY);
  } else if (key == 'a') {
  	nextSlice(1);
  } else if (key == 'z') {
  	nextSlice(-1);
  } else if (key == 's') {
  	left -= 100;
	image(images[currentSlice], left, top);
  } else if (key == 'z') {
  	left += 100;
	image(images[currentSlice], left, top);
  }
  return false; // prevent any default behavior
}