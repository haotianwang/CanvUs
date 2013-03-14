function drawRect(startx, starty, endx, endy, color, linewidth) {
	console.log("in drawModule.drawRect()");
	//do some preparation (store client state)
	clientColor = dispCtx.strokeStyle;
	clientLineWidth = dispCtx.lineWidth;

	//draw the other clients' rectangle
	var x = Math.min(startx, endx);
	var y = Math.min(starty, endy);
	var w = Math.abs(startx - endx);
	var h = Math.abs(starty - endy);
	dispCtx.strokeStyle = color;
	dispCtx.lineWidth = lineWidth;
	dispCtx.strokeRect(x,y,w,h);

	//restore client state
	dispCtx.strokeStyle = clientColor;
	dispCtx.lineWidth = clientLineWidth;
}

function drawCircle(startx, starty, endx, endy, color, lineWidth) {
	//do some preparation (finish "stroke" and store client state)

	var midX = (startx + endx) / 2
    var midY = (starty + endy) / 2
    var radius = Math.sqrt(Math.pow(endx - midX,2) + Math.pow(endy - midY,2));

	dispCtx.strokeStyle = color;
	dispCtx.lineWidth = lineWidth;
	
	dispCtx.beginPath();
    dispCtx.arc(midX, midY, radius, 0, Math.PI * 2, false);
    dispCtx.stroke();
}