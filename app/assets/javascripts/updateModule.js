/*
The UpdateModule class will incorporate all of the functionality of the Update Module.
After instantiating the class with new UpdateModule(), the function names directly map
to the functionality that the Update Module must have.
- UpdateModule.sendAction(DrawActionType, startx, starty, endx, endy)
	- DrawActionTypes supported (string): "rect", "circle", "line", "clear"
	- "clear" DrawActionType ignores other arguments
	- "line" DrawActionType also covers the "pencil" tool, since the pencil just draws a bunch of lines
- UpdateModule.handleGetAction(data)
- updateModule.getInitImg()

*/


$(document).ready(function() { 
	var updateModule = instantiateUpdateModule();
	updateModule.getInitImg();
	updateModule.sendAction("action testing testing 123");
	console.log(document.domain + document.port);
});

function instantiateUpdateModule() {
	var module = new UpdateModule();
	module.dispatcher.bind('socket.get_init_img', function(data){module.getInitImgHandler(data)});
	module.dispatcher.bind('socket.get_action', function(data){module.handleGetAction(data)});
	return module;
}

function UpdateModule() {
    this.url = document.URL;
	this.dispatcher = new WebSocketRails("localhost:3000/websocket");

    this.sendAction = function (action) {
		console.log("sending action...");
        this.dispatcher.trigger('socket.send_action', action);
    };

    this.handleGetAction = function (data) {
		console.log("got action! it's: " + data);
		this.callStubFunction("drawingModule.draw("+data+")");
    };

    this.getInitImg = function () {
		console.log("getting initial image...");
		this.dispatcher.trigger('socket.send_init_img', "");
    };

	this.getInitImgHandler = function (data) {
		this.callStubFunction("drawingModule.drawBitMap(someBitMap)");
		this.callStubFunction("drawingModule.drawActions(Array Actions)");
	};

	this.callStubFunction = function (functionName) {
		console.log("function called! " + functionName);
	}
}
