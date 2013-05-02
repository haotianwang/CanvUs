var prevX, prevY,
dispCanvas, dispCtx, 
drawCanvas, drawCtx,
backButton,
homeButton,
clrButton,
mouseDown = false,
tools = {},
tool,
pencilButton,
eraserButton,
eraseOn = false,
lineButton,
rectangleButton,
circleButton,
//blackButton,
//blueButton,
//redButton,
//lineThicknessBox,
//colorBox,
fillButton,
fillOn = false,
colorSelector,
buggyCircle = false,
buggyCircleButton,
buggyRectangle = false,
buggyRectangleButton,
buggyLine = false,
buggyLineButton,
dlPngButton,
textButton,
textBoxActive = false,
uploadButton,
formDown = false, //this is because class="btn" doesn't have "value"
doneButton,
fileBox,
debug = false,
prevTool = 'pencil',
currentTool = 'pencil', //defaults tool to pencil tool
updateModule,
uploadedImage = new Image(),
textInTextBox = [''],
numLetDict = ['0','1','2','3','4','5','6','7','8','9',
              'a','b','c','d','e','f','g','h','i','j',
              'k','l','m','n','o','p','q','r','s','t',
              'u','v','w','x','y','z'];

var browser,
//need canvas position for non-FF browsers
canvTop = 0, //offset for X
canvLeft = 0; //offset for Y

function initialize() {
	/*********************** get a new updateModule *****************/
    updateModule = instantiateUpdateModule(WebSocketRails);

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
                console.log(drawCanvas);
                clearCanvas(drawCanvas);
                drawLine(dispCanvas, prevX, prevY, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
				// send action to server
				updateModule.bucketAction("line", prevX, prevY, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
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
                updateModule.sendActions();
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
            if(!eraseOn) {
                drawCtx.strokeStyle = color;
            }
        };

        //don't capture keypresses outside of textbox tool
        document.onkeydown = function (event) {
            return;
        };
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
                clearCanvas(drawCanvas);
                drawLine(drawCanvas,tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
			//if buggyLine, then draw it on the disp canvas (permanent) and send to server
            } else {
                drawLine(dispCanvas,tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
                updateModule.bucketAction("line", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
            } 
        };

        this.mouseup = function (event) {
            if (mouseDown) {
                tool.mousemove(event);
                mouseDown = false;
                drawLine(dispCanvas,tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
				clearCanvas(drawCanvas);
                // send action to server
				updateModule.bucketAction("line", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
                updateModule.sendActions();
            }
        };

        this.changeColor = function(color) {
            drawCtx.strokeStyle = color;
        };

        //don't capture keypresses outside of textbox tool
        document.onkeydown = function (event) {
            return;
        };
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
                clearCanvas(drawCanvas);
                drawRectangle(drawCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
            //if buggyRect, then draw it on the disp canvas (permanent) and send to server
            } else {
                drawRectangle(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
                updateModule.bucketAction("rectangle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
            } 
        };

        this.mouseup = function (event) {
            if (mouseDown) {
                tool.mousemove(event);
                mouseDown = false;
                drawRectangle(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
				clearCanvas(drawCanvas);
                //send the action to server
				updateModule.bucketAction("rectangle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
                updateModule.sendActions();
            }
        };

        this.changeColor = function(color) {
            drawCtx.strokeStyle = color;
        };

        //don't capture keypresses outside of textbox tool
        document.onkeydown = function (event) {
            return;
        };
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
                clearCanvas(drawCanvas);
                drawCircle(drawCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
            //if buggyCircle, then draw it on the disp canvas (permanent) and send to server
            } else{
                drawCircle(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
                updateModule.bucketAction("circle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
            }
        };

        this.mouseup = function (event) {
            if (mouseDown) {
                tool.mousemove(event);
                mouseDown = false;
                drawCircle(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
				clearCanvas(drawCanvas);
                updateModule.bucketAction("circle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
                updateModule.sendActions();
            }
        };

        this.changeColor = function(color) {
            drawCtx.strokeStyle = color;
        }

        //don't capture keypresses outside of textbox tool
        document.onkeydown = function (event) {
            return;
        };  
    };

    //======================== TextBox ============================
    tools.textbox = function () {
        var tool = this;

        this.mousedown = function (event) {
            if(textBoxActive) {
                //copy contents onto dispCanvas
                clearCanvas(drawCanvas);
                uploadedImage.canvX = event.relx;
                uploadedImage.canvY = event.rely;
                for(var i = 0; i < textInTextBox.length; i++) {
                    drawTextOnCanvas(dispCanvas, textInTextBox[i], uploadedImage.canvX, uploadedImage.canvY+i*15);
                }
                for(var i = 0; i < textInTextBox.length; i++) {
                    updateModule.bucketAction("text", uploadedImage.canvX, uploadedImage.canvY+i*15, 0,0, textInTextBox[i]);
                }
                updateModule.sendActions();
                textBoxActive = false;
                textInTextBox = [''];
            } else {
                //create new textBox at cursor location
                textBoxActive = true;
            }
        };

        this.mousemove = function (event) {
            if(textBoxActive) {
                clearCanvas(drawCanvas);
                uploadedImage.canvX = event.relx;
                uploadedImage.canvY = event.rely;;
                for(var i = 0; i < textInTextBox.length; i++) {
                    drawTextOnCanvas(drawCanvas, textInTextBox[i], uploadedImage.canvX, uploadedImage.canvY+i*15);
                }
                //move textbox around with mouse
            }
        };

        this.mouseup = function (event) {
            //this will do nothing :)
            uploadedImage.canvX = event.relx;
            uploadedImage.canvY = event.rely;
        };

        document.onkeydown = function (event) {
            if(textBoxActive) {
                var charCode = (event.which) ? event.which : event.keyCode;
                if(charCode >= 48 && charCode <= 57) {
                    textInTextBox[textInTextBox.length-1] += numLetDict[charCode-48];
                }
                else if(charCode >= 96 && charCode <= 105){
                    textInTextBox[textInTextBox.length-1] += numLetDict[charCode-96];
                }
                else if(charCode >= 65 && charCode <= 90 ) {
                    textInTextBox[textInTextBox.length-1] += numLetDict[charCode-55];
                }
                else if(charCode == 32) {
                    textInTextBox[textInTextBox.length-1] += ' ';
                }
                else if(charCode == 8) {
                    if(textInTextBox[textInTextBox.length-1].length > 0){
                        textInTextBox[textInTextBox.length-1] = textInTextBox[textInTextBox.length-1].substring(0, textInTextBox[textInTextBox.length-1].length-1)
                    }
                    else if (textInTextBox.length > 1){
                        textInTextBox.pop();
                    }
                }
                else if(charCode == 13) {
                    textInTextBox.push('');
                }
                clearCanvas(drawCanvas);
                for(var i = 0; i < textInTextBox.length; i++) {
                    drawTextOnCanvas(drawCanvas, textInTextBox[i], uploadedImage.canvX, uploadedImage.canvY+i*15);
                }
                console.log(charCode);
                console.log(textInTextBox);
            }
            return false;
        };
    };

    //======================== MovePicture ============================
    tools.movepicture = function () {
        var tool = this;

        this.mousedown = function (event) {
            if(mouseDown) {
                //call mouseup
                tool.mouseup();
            } else {
                mouseDown = true;
                uploadedImage.canvX = event.relx - uploadedImage.width / 2;
                uploadedImage.canvY = event.rely - uploadedImage.height / 2;
                drawImageOnCanvas(drawCanvas, uploadedImage.src, uploadedImage.canvX, uploadedImage.canvY);
            }
        };

        this.mousemove = function (event) {
            if(!mouseDown)
                return;
            clearCanvas(drawCanvas);
            uploadedImage.canvX = event.relx - uploadedImage.width / 2;
            uploadedImage.canvY = event.rely - uploadedImage.height / 2;
            drawImageOnCanvas(drawCanvas, uploadedImage.src, uploadedImage.canvX, uploadedImage.canvY);

        };

        this.mouseup = function (event) {
            if(mouseDown) {
                mouseDown = false;
                //copy contents onto dispcontext
                drawImageOnCanvas(dispCanvas, uploadedImage.src,uploadedImage.canvX , uploadedImage.canvY);
                //send to update module
                updateModule.bucketAction("image", uploadedImage.canvX, uploadedImage.canvY, 0, 0 ,uploadedImage.src);
                updateModule.sendActions();
                setTool(prevTool);
            }
        };

        //don't capture keypresses outside of textbox tool
        document.onkeydown = function (event) {
            return;
        };
    };

    dispCanvas = document.getElementById('myCanvas');
    dispCtx = dispCanvas.getContext("2d");
    dispCtx.lineCap = "round"; //set line cap to round
    dispCtx.lineJoin = "round"; //set line join to be round (no more jaggies)
    backButton = document.getElementById('back-button');
    homeButton = document.getElementById('home-button');
    clrButton = document.getElementById('clear-button');
    fillButton = document.getElementById('fill-button');
    var changeThickValue = document.getElementById('thick-button');
    //blackButton = document.getElementById('black-button');
    //blueButton = document.getElementById('blue-button');
    //redButton = document.getElementById('red-button');
    //lineThicknessBox = document.getElementById("line-thickness-box");
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
    textButton = document.getElementById("text-button");
    uploadButton = document.getElementById("upload-button");
    doneButton = document.getElementById("done-button");
    lineThick1 = document.getElementById("thick-1");
    lineThick2 = document.getElementById("thick-2");
    lineThick4 = document.getElementById("thick-4");
    lineThick8 = document.getElementById("thick-8");
    lineThick16 = document.getElementById("thick-16");
    lineThick32 = document.getElementById("thick-32");
    lineThick64 = document.getElementById("thick-64");

    //set the default context to the dispCtx for the updateModule
    updateModule.resetDefaults();
    updateModule.setCanvas(dispCanvas);
    //updateModule.setContext(dispCtx);
    //initialize
    updateModule.initialize();
    updateModule.startTimer();

    //Create the "drawCanvas" - the canvas which we draw on, and then copy
    // onto dispCanvas
    var cnvsContainer = dispCanvas.parentNode;
    drawCanvas = document.createElement('canvas');
    drawCanvas.id = "drawCanvas";
    drawCanvas.width = dispCanvas.width;
    drawCanvas.height = dispCanvas.height;
    drawCanvas.style.border = "3px solid #FFFFFF ";
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

    //hide the upload form
    $('#load-div').hide();


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
        drawCanvas.style.left = canvLeft /*- 8*/ + "px";
    }

    //set up canvas once
    windowResize();

    //Activate default tool:
    tool = new tools[currentTool]();



    //This function draws the "drawing" layer onto the background layer
    function canvasUpdate() {
        dispCtx.drawImage(drawCanvas,0,0);
        clearCanvas(drawCanvas);
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

    //======================== Clear ============================

    clrButton.onclick = function() { 
        if(currentTool == "movepicture"){
            //revert the tool
            currentTool = prevTool;
            tool = new tools[currentTool]();
        }
		clearCanvas(dispCanvas);
        clearCanvas(drawCanvas);
		// send the clear to server, everything else can be filler values
		updateModule.bucketAction("clear", 0,0,0,0,0,0);
        updateModule.sendActions();

        return false;
    };

    function checkMovePic() {
        if(currentTool == "movepicture"){
            tool.mouseup();
        }
    }

    fillButton.onclick = function() {
        if(currentTool == "movepicture"){
            checkMovePic(); //set picture
            //revert the tool
            currentTool = prevTool;
            tool = new tools[currentTool]();
            
        }
        fillOn = !fillOn;
        fileButton.checked = true;
        console.log("fillOn is now: " + fillOn);
        return false;
    }

    pencilButton.onclick = function() {
        checkMovePic();
        currentTool = "pencil";
        tool = new tools[currentTool]();
        return false;
    };
    
    /*
    eraserButton.onclick = function() {

    }
    */

    lineButton.onclick = function() {
        checkMovePic();
        buggyLine = false;
        currentTool = "line";
        tool = new tools[currentTool]();
        return false;
    };

    rectangleButton.onclick = function() {
        checkMovePic();
        prevTool = currentTool
        currentTool = "rectangle";
        buggyRectangle = false;
        tool = new tools[currentTool]();
        return false;
    };

    circleButton.onclick = function() {
        checkMovePic();
        buggyCircle = false;
        currentTool = "circle";
        tool = new tools[currentTool]();
        return false;
    };

    buggyLineButton.onclick = function() {
        checkMovePic();
        //lets you play with the buggy line
        drawCtx.beginPath();
        buggyLine = true;
        currentTool = "line";
        tool = new tools[currentTool]();
        return false;
    }

    buggyCircleButton.onclick = function() {
        checkMovePic();
        //lets you play with the buggy circle
        drawCtx.beginPath();
        buggyCircle = true;
        currentTool = "circle";
        tool = new tools[currentTool]();
        return false;
    }

    buggyRectangleButton.onclick = function() {
        checkMovePic();
        //lets you play with the buggy rectangle
        drawCtx.beginPath();
        buggyRectangle = true;
        currentTool = "rectangle";
        tool = new tools[currentTool]();
        return false;
    }

    textButton.onclick = function() {
        checkMovePic();
        prevTool = currentTool
        currentTool = "textbox";
        tool = new tools[currentTool]();
        textBoxActive = false;
        return false;
    }

    /*
    //Draw no longer has black/blue/red buttons for quick select
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
    */

    colorSelector.onchange= function (event) {
        if(currentTool == "movepicture"){
            checkMovePic(); //set picture
            //revert the tool
            currentTool = prevTool;
            tool = new tools[currentTool]();
        }
        console.log("in here" + colorSelector.value)
        tool.changeColor(colorSelector.value);
        //return false; //return false on enter (else canvas cleared)
    };

    /*
    //this button works the same for circle rectangle and pencil
    lineThicknessBox.onkeydown = function (event) {
        if(event.keyCode == 13) { //only check for enter
            drawCtx.lineWidth = parseInt(lineThicknessBox.value);
            lineThicknessBox.value = "Line Thickness";
            return false; //return false on enter (else canvas cleared)
        }
        //no return for other key presses, else key press doesn't happen
    };
    */

    lineThick1.onclick = function () {
        changeLineThickness(1);
        return false;
    };
    lineThick2.onclick = function () {
        changeLineThickness(2);
        return false;
    };
    lineThick4.onclick = function () {
        changeLineThickness(4);
        return false;
    };
    lineThick8.onclick = function () {
        changeLineThickness(8);
        return false;
    };
    lineThick16.onclick = function () {
        changeLineThickness(16);
        return false;
    };
    lineThick32.onclick = function () {
        changeLineThickness(32);
        return false;
    };
    lineThick64.onclick = function () {
        changeLineThickness(64);
        return false;
    };

    function changeLineThickness(thickness) {
        drawCtx.lineWidth = thickness;
        changeThickValue.innerHTML = thickness + "px "
        $('#thick-button').append("<span class='caret'></span>");
    }

    dlPngButton.onclick = function(event) {
        Canvas2Image.saveAsPNG(dispCanvas);
        document.getElementById('canvas-message2').innerHTML = "Thanks for download the image, plese rename file to <filename>.png to view"; 
        return false;
    }

    /*
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
    */

    uploadButton.onclick = function() {
        checkMovePic();
        if(!formDown){
            $("#load-div").slideDown('slow')
            formDown = true;
        } else {
            $("#load-div").slideUp('slow')
            formDown = false;
        }
        return false;
    }

    doneButton.onclick = function() {
        var input, file, fr;

        if (typeof window.FileReader !== 'function') {
            write("The file API isn't supported on this browser yet.");
            return;
        }

        input = document.getElementById('file-box');
        if (!input) {
            write("Um, couldn't find the imgfile element.");
        }
        else if (!input.files) {
            write("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
            write("Please select a file before clicking 'Load'");
        }
        else {
            file = input.files[0];
            fr = new FileReader();
            fr.onload = setUpDrawImage;
            fr.readAsDataURL(file);
        }

        function setUpDrawImage() {
            uploadedImage = new Image();
            uploadedImage.onload = function() {
                drawImageOnCanvas(drawCanvas, fr.result, 
                    drawCanvas.width/2 - uploadedImage.width/2, 
                    drawCanvas.height/2 - uploadedImage.height/2)
                uploadedImage.canvX = drawCanvas.width/2 - uploadedImage.width/2;
                uploadedImage.canvY = drawCanvas.height/2 - uploadedImage.height/2;
            }
            uploadedImage.src = fr.result;
        }

        function write(msg) {
            var p = document.createElement('p');
            p.innerHTML = msg;
            document.body.appendChild(p);
        }
        //since the file input is read-only, we must replace the entire thing to clear
        var imgInput = $('#file-box');
        imgInput.replaceWith( imgInput = imgInput.val('').clone( true ) );
        fileBox = document.getElementById('file-box');
        formDown = false;
        $("#load-div").slideUp('slow');
        prevTool = currentTool
        currentTool = "movepicture";
        tool = new tools[currentTool]();
    }


    function setTool(newTool) {
        currentTool = newTool;
        tool = new tools[currentTool]();
    }

    backButton.onclick = function() {
        //okay room for logic. Should the back button take you back to the original page?
        //or should it take you back to the page the canvus is on? 
        window.location.href = "http://" + window.location.host;
    }

    
}

