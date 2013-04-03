
//** WARNING ** These methods do not store th old state of the context, so 
// if you change the strokeStyle and lineWidth, they do NOT get restored
function drawRectangle(canvas, startx, starty, endx, endy, color, lineWidth) {
	//draw the other clients' rectangle
	var x = Math.min(startx, endx);
	var y = Math.min(starty, endy);
	var w = Math.abs(startx - endx);
	var h = Math.abs(starty - endy);
	canvas.getContext("2d").strokeStyle = color;
	canvas.getContext("2d").lineWidth = lineWidth;
	canvas.getContext("2d").strokeRect(x,y,w,h);
}

function drawCircle(canvas, startx, starty, endx, endy, color, lineWidth) {
	var midX = (startx + endx) / 2
    var midY = (starty + endy) / 2
    var radius = Math.sqrt(Math.pow(endx - midX,2) + Math.pow(endy - midY,2));

	canvas.getContext("2d").strokeStyle = color;
	canvas.getContext("2d").lineWidth = lineWidth;
	
	canvas.getContext("2d").beginPath();
    canvas.getContext("2d").arc(midX, midY, radius, 0, Math.PI * 2, false);
    canvas.getContext("2d").stroke();
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
function drawBitmap(canvas, imageData) {
	var imageToLoad = new Image();
	imageToLoad.src = imageData;
	canvas.getContext("2d").drawImage(imageToLoad,0,0);
}