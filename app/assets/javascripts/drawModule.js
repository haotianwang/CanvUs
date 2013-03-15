
//** WARNING ** These methods do not store th old state of the context, so 
// if you change the strokeStyle and lineWidth, they do NOT get restored
function drawRectangle(context, startx, starty, endx, endy, color, lineWidth) {
	//draw the other clients' rectangle
	var x = Math.min(startx, endx);
	var y = Math.min(starty, endy);
	var w = Math.abs(startx - endx);
	var h = Math.abs(starty - endy);
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	context.strokeRect(x,y,w,h);
}

function drawCircle(context, startx, starty, endx, endy, color, lineWidth) {
	var midX = (startx + endx) / 2
    var midY = (starty + endy) / 2
    var radius = Math.sqrt(Math.pow(endx - midX,2) + Math.pow(endy - midY,2));

	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	
	context.beginPath();
    context.arc(midX, midY, radius, 0, Math.PI * 2, false);
    context.stroke();
}

function drawLine(context, startx, starty, endx, endy, color, lineWidth) {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;

	context.beginPath();
	context.moveTo(startx, starty);
	context.lineTo(endx, endy);
	context.stroke();
}

function clearCanvas(context) {
    context.clearRect(0,0,dispCanvas.width, dispCanvas.height)
}
