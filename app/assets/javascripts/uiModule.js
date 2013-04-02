var prevX, prevY,
dispCanvas, dispCtx, 
drawCanvas, drawCtx,
clrButton,
mouseDown = false,
tools = {},
tool,
pencilButton,
lineButton,
rectangleButton,
circleButton,
blackButton,
blueButton,
redButton,
lineThicknessBox,
colorBox,
colorSelector,
buggyCircle = false,
buggyCircleButton,
buggyRectangle = false,
buggyRectangleButton,
buggyLine = false,
buggyLineButton,
dlPngButton,
debug = false,
currentTool = 'pencil', //defaults tool to pencil tool
updateModule; 

var browser,
//need canvas position for non-FF browsers
canvTop = 0, //offset for X
canvLeft = 0; //offset for Y

function initialize() {
	/*********************** get a new updateModule *****************/
	updateModule = instantiateUpdateModule(WebSocketRails);
    updateModule.initialize();

    /*********************** Tools Declarations *********************/

    //======================== Pencil ============================
    tools.pencil = function () {
        var tool = this;
        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function (event) {
            drawCtx.moveTo(event.relx, event.rely)
            mouseDown = true;
			prevX = event.relx;
			prevY = event.rely;
        };

        // This function is called every time you move the mouse. 
        //  only runs if mouse is down
        this.mousemove = function (event) {
            if (mouseDown) {
                if(debug) console.log("calling " + currentTool+ ":" + event.type + " with mousedown, drawing at " +event.relx + " " + event.rely);
                drawCtx.lineTo(event.relx, event.rely);
                drawCtx.stroke();
                //canvasUpdate();
                clearCanvas(drawCtx);
                drawLine(dispCtx, prevX, prevY, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
				// send action to server
				updateModule.sendAction("line", prevX, prevY, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
				prevX = event.relx;
                prevY = event.rely;
            }
        };

        // This is called when you release the mouse button.
        this.mouseup = function (event) {
            if (mouseDown) {
                tool.mousemove(event);
                mouseDown = false;
				drawCtx.beginPath();
            }
        };

        this.mouseout = function(event) {
            if(debug) console.log("exit coords mouseout: " + event.relx + ' ' + event.rely);
            event.relx = prevX;
            event.rely = prevY;
            tool.mouseup(event);
            mouseDown = false;
        };

        this.changeColor = function(color) {
            drawCtx.strokeStyle = color;
        }
    };

    //======================== Line ============================
    tools.line = function () {
        var tool = this;
        var oldx = 0, oldy = 0;

        this.mousedown = function (event) {
            if(mouseDown) {
                tool.mouseup(event);
            } else {
                mouseDown = true;
                tool.x0 = event.relx;
                tool.y0 = event.rely;
                drawCtx.beginPath();
            }
        };

        this.mousemove = function (event) {
            if (!mouseDown) {
                return;
            }

            //if not buggyLine, then draw it on the draw canvas (not permanent)
            if(!buggyLine) {
                clearCanvas(drawCtx);
                drawLine(drawCtx,tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
			//if buggyLine, then draw it on the disp canvas (permanent) and send to server
            } else {
                drawLine(dispCtx,tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
                updateModule.sendAction("line", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            } 
        };

        this.mouseup = function (event) {
            if (mouseDown) {
                tool.mousemove(event);
                mouseDown = false;
                drawLine(dispCtx,tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
				clearCanvas(drawCtx);
                // send action to server
				updateModule.sendAction("line", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            }
        };

        this.changeColor = function(color) {
            drawCtx.strokeStyle = color;
        }
    };

    //======================== Rectangle ============================
    tools.rectangle = function () {
        var tool = this;

        this.mousedown = function (event) {
            if(mouseDown) {
                tool.mouseup(event);
            } else {
                mouseDown = true;
                tool.x0 = event.relx;
                tool.y0 = event.rely;
            }
        };

        this.mousemove = function (event) {
            if (!mouseDown) {
                return;
            }
            //if not buggyRectangle, then draw it on the draw canvas (not permanent)
            if(!buggyRectangle) {
                clearCanvas(drawCtx);
                drawRectangle(drawCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            //if buggyRect, then draw it on the disp canvas (permanent) and send to server
            } else {
                drawRectangle(dispCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
                updateModule.sendAction("rectangle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            } 
        };

        this.mouseup = function (event) {
            if (mouseDown) {
                tool.mousemove(event);
                mouseDown = false;
                drawRectangle(dispCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
				clearCanvas(drawCtx);
                //send the action to server
				updateModule.sendAction("rectangle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            }
        };

        this.changeColor = function(color) {
            drawCtx.strokeStyle = color;
        }
    };

    //======================== Circle ============================
    tools.circle = function () {
        var tool = this;

        this.mousedown = function (event) {
            if(mouseDown) {
                //if user went outside canvas while drawing, let them continue
                tool.mouseup(event);
            } else {
                mouseDown = true;
                tool.x0 = event.relx;
                tool.y0 = event.rely;
                drawCtx.beginPath();
            }
        };

        this.mousemove = function (event) {
            if (!mouseDown) {
                return;
            }
            //if not buggyCircle, then draw it on the draw canvas (not permanent)
            if(!buggyCircle) {
                clearCanvas(drawCtx);
                drawCircle(drawCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            //if buggyCircle, then draw it on the disp canvas (permanent) and send to server
            } else{
                drawCircle(dispCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
                updateModule.sendAction("circle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            }
        };

        this.mouseup = function (event) {
            if (mouseDown) {
                tool.mousemove(event);
                mouseDown = false;
                drawCircle(dispCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
				clearCanvas(drawCtx);
                updateModule.sendAction("circle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            }
        };

        this.changeColor = function(color) {
            drawCtx.strokeStyle = color;
        }
    };

    //======================== Clear ============================
	tools.clear = function () {
        clearCanvas(dispCtx); 
        clearCanvas(drawCtx);
	};

    dispCanvas = document.getElementById('myCanvas');
    dispCtx = dispCanvas.getContext("2d");
    clrButton = document.getElementById('clear-button');
    blackButton = document.getElementById('black-button');
    blueButton = document.getElementById('blue-button');
    redButton = document.getElementById('red-button');
    lineThicknessBox = document.getElementById("line-thickness-box");
    //colorBox = document.getElementById("color-box"); //<- depricated by colorSelector
    colorSelector = document.getElementById("color-selector");
    pencilButton = document.getElementById("pencil-button")
    lineButton = document.getElementById("line-button");
    rectangleButton = document.getElementById("rectangle-button");
    circleButton = document.getElementById("circle-button");
    buggyCircleButton = document.getElementById("buggy-circle-button");
    buggyRectangleButton = document.getElementById("buggy-rectangle-button");
    buggyLineButton = document.getElementById("buggy-line-button");
    debugButton = document.getElementById("debug-button");
    dlPngButton = document.getElementById("download-png-button");

    //set the default context to the dispCtx for the updateModule
    updateModule.setContext(dispCtx);
    //initialize
    updateModule.initialize();

    //Create the "drawCanvas" - the canvas which we draw on, and then copy
    // onto dispCanvas
    var cnvsContainer = dispCanvas.parentNode;
    drawCanvas = document.createElement('canvas');
    drawCanvas.id = "drawCanvas";
    drawCanvas.width = dispCanvas.width;
    drawCanvas.height = dispCanvas.height;
    drawCanvas.style.border = "1px solid #FF0000";
    cnvsContainer.appendChild(drawCanvas);
    drawCtx = drawCanvas.getContext('2d');
    drawCtx.lineCap = "round"; //set line cap to round
    drawCtx.lineJoin = "round"; //set line join to be round (no more jaggies)

    drawCanvas.addEventListener('mouseover', handleEvent, false);
    drawCanvas.addEventListener('mouseout', handleEvent, false);
    drawCanvas.addEventListener('mousedown', handleEvent, false);
    drawCanvas.addEventListener('mousemove', handleEvent, false);
    drawCanvas.addEventListener('mouseup',   handleEvent, false);

    //Detect browser:
    if('MozBoxSizing' in document.documentElement.style) {
        browser = "firefox"
    } else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
        browser = "safari"
    } else if(!!(window.chrome && chrome.webstore && chrome.webstore.install)) {
        browser = "chrome"
    } else if('msTransform' in document.documentElement.style) {
        browser = "ie"
    } else {
        browser = "unknown browser"
    }


    //called the first time, and every time the display canvas changes
    function windowResize() {
        //set the drawCanvas' position to absolute and top & left to 0
        // this is because the display canvas has been centered, and to put the 
        // drawing canvas over it, we need to find the offset from 0,0
        drawCanvas.style.position = "absolute"
        drawCanvas.style.top = "0px";
        drawCanvas.style.left = "0px";

        //find the offset of the display canvas to position the drawing canvas and
        // in chrome/safari use the offset to offset event.x and event.y to draw right
        canvLeft = 0, canvTop = 0, temp = dispCanvas;
        if (temp.offsetParent) {
            do {
                canvLeft += temp.offsetLeft;
                canvTop += temp.offsetTop;
            } while (temp = temp.offsetParent);
        }
     
        //move canvas to the right by canvLeft pixels
        //shift if left by 8, because something adds a 8 pixel shift
        drawCanvas.style.left = canvLeft - 8 + "px";
    }

    //set up canvas once
    windowResize();

    //Activate default tool:
    tool = new tools[currentTool]();



    //This function draws the "drawing" layer onto the background layer
    function canvasUpdate() {
        dispCtx.drawImage(drawCanvas,0,0);
        clearCanvas(drawCtx);
    }

    function handleEvent(event) {
        //console.log(event.type);
        //get the x and y offset in terms of the canvas, two ways
        // to support multiple browsers (offset doesn't work with firefox)
        if(browser == "chrome" || browser == "safari") { //for Chrome/Opera
            //was using event.x and event.y, but event.x and event.y works if you don't scroll down
            // because they refer to where in the visible browser window you clicked.
            event.relx = event.offsetX;
            event.rely = event.offsetY;
        }
        else if(browser = "firefox" || browser == "ie") { //For Firefox
            //layer provided by firefox gives us the relative position
            event.relx = event.layerX;
            event.rely = event.layerY;
        }

        var funcToCall = tool[event.type];
        if(funcToCall) {//check if it's valid
            //if(debug) console.log("calling " + currentTool+ ":" + event.type)
            funcToCall(event)
        } else {
            if(debug) console.log(currentTool + " has no associated function " + event.type);
        }
    }

    window.onresize = function() {
        if(debug) console.log("canvas is resizing");
        windowResize();
    };

    clrButton.onclick = function() { 
		clearCanvas(dispCtx);
        clearCanvas(drawCtx);
		// send the clear to server, everything else can be filler values
		updateModule.sendAction("clear", 0,0,0,0,0,0);

        return false;
    };


    pencilButton.onclick = function() {
        currentTool = "pencil";
        tool = new tools[currentTool]();
        return false;
    };

    lineButton.onclick = function() {
        console.log("here")
        buggyLine = false;
        currentTool = "line";
        tool = new tools[currentTool]();
        return false;
    };

    rectangleButton.onclick = function() {
        currentTool = "rectangle";
        buggyRectangle = false;
        tool = new tools[currentTool]();
        return false;
    };

    circleButton.onclick = function() {
        buggyCircle = false;
        currentTool = "circle";
        tool = new tools[currentTool]();
        return false;
    };

    buggyLineButton.onclick = function() {
        //lets you play with the buggy line
        drawCtx.beginPath();
        buggyLine = true;
        currentTool = "line";
        tool = new tools[currentTool]();
        return false;
    }

    buggyCircleButton.onclick = function() {
        //lets you play with the buggy circle
        drawCtx.beginPath();
        buggyCircle = true;
        currentTool = "circle";
        tool = new tools[currentTool]();
        return false;
    }

    buggyRectangleButton.onclick = function() {
        //lets you play with the buggy rectangle
        drawCtx.beginPath();
        buggyRectangle = true;
        currentTool = "rectangle";
        tool = new tools[currentTool]();
        return false;
    }

    blackButton.onclick = function() {
        tool.changeColor('#000000');
        return false;
    };

    blueButton.onclick = function () {
        tool.changeColor('#0000FF');
        return false;
    };

    redButton.onclick = function () {
        tool.changeColor('#FF0000');
        return false;
    };

    colorSelector.onchange= function (event) {
        console.log("in here" + colorSelector.value)
        tool.changeColor(colorSelector.value);
        //return false; //return false on enter (else canvas cleared)
    };

    //this button works the same for circle rectangle and pencil
    lineThicknessBox.onkeydown = function (event) {
        if(event.keyCode == 13) { //only check for enter
            drawCtx.lineWidth = parseInt(lineThicknessBox.value);
            lineThicknessBox.value = "Line Thickness";
            return false; //return false on enter (else canvas cleared)
        }
        //no return for other key presses, else key press doesn't happen
    };

    console.log(dlPngButton);
    dlPngButton.onclick = function(event) {
        Canvas2Image.saveAsPNG(dispCanvas);
        document.getElementById('canvas-message2').innerHTML = "Thanks for download the image, plese rename file to <filename>.png to view"; 
        return false;
    }

    debugButton.onclick = function () {
        debug = !debug;
        if(debug) {
            debugButton.value = "Debug On (look at console)";
            console.log("browser is: " + browser);
            if(canvTop) console.log("canvTop: " + canvTop + " canvLeft: " + canvLeft);
        } else {
            debugButton.value = "Debug Off";
        }
        return false;
    };
}

