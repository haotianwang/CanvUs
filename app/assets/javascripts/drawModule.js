
//** WARNING ** These methods do not store th old state of the context, so 
// if you change the strokeStyle and lineWidth, they do NOT get restored
function drawRectangle(canvas, startx, starty, endx, endy, color, lineWidth, fillOn) {
	//draw the other clients' rectangle
	var x = Math.min(startx, endx);
	var y = Math.min(starty, endy);
	var w = Math.abs(startx - endx);
	var h = Math.abs(starty - endy);
	canvas.getContext("2d").strokeStyle = color;
	canvas.getContext("2d").lineWidth = lineWidth;
    if(fillOn) {
		canvas.getContext("2d").fillStyle = color;
    	canvas.getContext("2d").fillRect(x,y,w,h);
	}
	canvas.getContext("2d").strokeRect(x,y,w,h);
}

function drawCircle(canvas, startx, starty, endx, endy, color, lineWidth, fillOn) {
	var midX = (startx + endx) / 2
    var midY = (starty + endy) / 2
    var radius = Math.sqrt(Math.pow(endx - midX,2) + Math.pow(endy - midY,2));

	canvas.getContext("2d").strokeStyle = color;
	canvas.getContext("2d").lineWidth = lineWidth;

	canvas.getContext("2d").beginPath();
    canvas.getContext("2d").arc(midX, midY, radius, 0, Math.PI * 2, false);
    canvas.getContext("2d").stroke();
    if(fillOn){
    	canvas.getContext("2d").fillStyle = color;
    	canvas.getContext("2d").fill();
    }
}

function drawLine(canvas, startx, starty, endx, endy, color, lineWidth) {
	canvas.getContext("2d").strokeStyle = color;
	canvas.getContext("2d").lineWidth = lineWidth;

	canvas.getContext("2d").beginPath();
	canvas.getContext("2d").moveTo(startx, starty);
	canvas.getContext("2d").lineTo(endx, endy);
	canvas.getContext("2d").stroke();
}

function clearCanvas(canvas) {
    canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height)
}

/* Inputs:
 * 	   canvas = an HTML5 canvas reference
 *     imageData = the url string from calling <canvas>.toDataURL("image/png")
 */
function drawBitmap(canvas, imageData, callbackObject, callbackFunction) {
	var imageToLoad = new Image();
	imageToLoad.onload = function() {
		canvas.getContext("2d").drawImage(imageToLoad,0,0);
		console.log("the image has loaded!");

		if (callbackObject != null && callbackFunction != null) {
			callbackFunction.call(callbackObject);
		}
		else if (callbackObject == null && callbackFunction != null) {
			callbackFunction();
		}

	};
	imageToLoad.src = imageData;
}

/* Inputs:
 * canvas = an HTML5 canvas reference
 * imageData = the data for the image
 * canvX, canvY = where on canvas to put the image 
 */
function drawImageOnCanvas(canvas, imageData, canvX, canvY) {
	var img = new Image();
	img.onload = function () {
		canvas.getContext('2d').drawImage(img,0,0,img.width, img.height,
    	canvX, canvY, img.width, img.height);
	};
	img.src = imageData;
}

/* Inputs:
 * canvas = an HTML5 canvas reference
 * text = the text to draw on the canvas
 * canvX, canvY = where on the canvas to write the text
 */
function drawTextOnCanvas(canvas, text, canvX, canvY) {
	console.log(text);
	canvas.getContext('2d').font = "bold 12px monospace";
	canvas.getContext('2d').fillText(text, canvX, canvY);
}