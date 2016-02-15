var canvasWidth = 300;
var canvasHeight = 300;

var lowerSlider, upperSlider

var pos = 25;
var currentSlice = 0;
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

function draw() {
  background(237, 34, 93);
  fill(0);
  rect(25, pos, 50, 50);

	var lowerSliderVal = lowerSlider.value();
	var upperSliderVal = upperSlider.value();
	//canvas.background(lowerSliderVal, upperSliderVal, 93);

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
  //print(event.delta);
  //move the square according to the vertical scroll amount
  if (mouseisincanvas()) {
  		pos += 5 * event.delta;
  		//uncomment to block page scrolling
		return false;
	} else {
		return true
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