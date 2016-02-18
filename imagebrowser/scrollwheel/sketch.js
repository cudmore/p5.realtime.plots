var canvasWidth = 320;
var canvasHeight = 320;

var lowerSlider, upperSlider

var images = [];
var currentSlice = 0;
var numSlices = 11;
var button;

function setup() {
	canvas = createCanvas(canvasWidth,canvasHeight)
 
	lowerSlider = createSlider(0, 255, 100);
	lowerSlider.position(20, 320);
	upperSlider = createSlider(0, 255, 100);
	upperSlider.position(20, 350);

	button = createButton('play');

	//canvas.mouseWheel(canvas_mousewheel, event);
 
}

//a predefined p5 function, like draw()
function preload() {
	images[currentSlice] = loadImage("images/Untitled_" + currentSlice + ".png");  // Load the image
}

function draw() {
	var lowerSliderVal = lowerSlider.value();
	var upperSliderVal = upperSlider.value();
	//canvas.background(lowerSliderVal, upperSliderVal, 93);
	
	if (images[currentSlice] != null) {
		image(images[currentSlice]);
	}

}

function canvas_mousewheel(event) {
	//event does not get passed?
	//var inc = keyPressed & keyCode == CONTROL ? -1 : -5;
	//print(event);
	//currentSlice += event.delta;
	//print ("canvas_mousewheel " + currentSlice);
}

function mouseisincanvas() {
	return (mouseX>0 && mouseX<canvasWidth);
}

//global
function mouseWheel(event) {
  if (mouseisincanvas()) {
  		//print(event.delta); //up is +1, down is -1
  		currentSlice -= event.delta;
  		if (currentSlice<0) { currentSlice=0; }
  		else if (currentSlice>numSlices-1) { currentSlice = numSlices-1; }
  		
  		if (images[currentSlice] == null) {
  			images[currentSlice] = loadImage("images/Untitled_" + currentSlice + ".png");  // Load the image
		}
  		
		images[currentSlice].loadPixels();
  		print("a " + images[currentSlice].pixels[0]);
  		print("b pixel length " + images[currentSlice].pixels.length);
  		var black = color(199);
		images[currentSlice].pixels[0] = black;
  		print("c" + images[currentSlice].pixels[0]);
  		print("d pixel length " + images[currentSlice].pixels.length);
  		images[currentSlice].updatePixels();
  		//print("c" + images[currentSlice].pixels[0]);
		image(images[currentSlice]);
  		
		return false; //blocks page scrolling
	} else {
		return true //allow page scrolling
	}
}

function keyTyped() {
  if (key === '+') {
    print('+ ' + mouseX + ' ' + mouseY);
  } else if (key === '-') {
    print('- ' + mouseX + ' ' + mouseY);
  }
  return false; // prevent any default behavior
}