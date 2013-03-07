var prevX = -1,
	prevY = -1;

/************* function cnvs_clearCanvas *************
 * This function clears the canvas object by first 
 */
function clearCanvas() {
    prevX = -1;
    prevY = -1;
    var c=document.getElementById("myCanvas");
    c.width = c.width;
    var ctx=c.getContext("2d");
    ctx.moveTo(0,0);
    document.getElementById('canvas-coord-message').innerHTML = "";
}

 function drawLine(e)
 {
    var x, y;

    //get the x and y offset in terms of the canvas, two ways
    // to support multiple browsers (offset doesn't work with firefox)
    if(e.offsetX) {
        x = e.offsetX;
        y = e.offsetY;
    }
    else if(e.layerX) {
        x = e.layerX;
        y = e.layerY;
    }

    if(prevX > -1 && prevY > -1) {
        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        ctx.moveTo(prevX,prevY);
        ctx.lineTo(x,y);
        ctx.stroke();
    }
    prevX = x;
    prevY = y;
    document.getElementById('canvas-coord-message').innerHTML = "x: " + x + " y: " + y;
}