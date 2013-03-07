var prevX = -1,
	prevY = -1,
	canvas = document.getElementById('myCanvas'),
	clrButton = document.getElementById('clear-button'),
	mouseDown = 0,
	counter = 0;

function initialize() {
	canvas = document.getElementById('myCanvas'),
	clrButton = document.getElementById('clear-button'),

	canvas.onmousemove = function(e) {
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
		document.getElementById('canvas-coord-message').innerHTML = "x: " + x + " y: " + y;
		if(mouseDown == 1) {
			drawLine(x,y);
		}
	}

	canvas.onmouseover = function(event) {
		if(mouseDown == 1) {
			drawLine(event);
		}
	}

	canvas.onmouseout = function(event) {
		document.getElementById('canvas-coord-message').innerHTML = "";	
	}

	canvas.addEventListener('mousedown', function() { 
		mouseDown = 1;
	}, false);

	canvas.addEventListener('mouseup', function() { 
		prevX = prevY = -1;
		document.getElementById('canvas-coord-message').innerHTML = "";
		mouseDown = 0;
	}, false);

	clrButton.onclick = function(){clearCanvas()}
}


/************* function cnvs_clearCanvas *************
 * This function clears the canvas object by first 
 */
function clearCanvas() {
    prevX = -1;
    prevY = -1;
    canvas.width = canvas.width;
    var ctx=canvas.getContext("2d");
    ctx.moveTo(0,0);
}

 function drawLine(x,y)
 {
    if(prevX > -1 && prevY > -1) {
        var ctx = canvas.getContext("2d");
        ctx.moveTo(prevX,prevY);
        ctx.lineTo(x,y);
        ctx.stroke();
    }
    prevX = x;
    prevY = y;
}