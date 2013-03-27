/*
The UpdateModule class will incorporate all of the functionality of the Update Module.
After instantiating the class with new UpdateModule(), the function names directly map
to the functionality that the Update Module must have.
- UpdateModule.sendAction(DrawActionType, startx, starty, endx, endy, color, strokeWidth)
	- DrawActionTypes supported (string): "rect", "circle", "line", "clear"
	- "clear" DrawActionType ignores other arguments
	- "line" DrawActionType also covers the "pencil" tool, since the pencil just draws a bunch of lines
- UpdateModule.handleGetAction(data)
- updateModule.getInitImg()

*/

/*
$(document).ready(function() { 
	var updateModule = instantiateUpdateModule();
	updateModule.getInitImg();
	updateModule.sendAction("action testing testing 123");
	console.log(document.domain + document.port);
});
*/

function instantiateUpdateModule(socketClass) {
	var module = new UpdateModule(socketClass);
	module.dispatcher.bind('socket.get_init_img', function(data){module.getInitImgHandler(data)});
	module.dispatcher.bind('socket.get_action', function(data){module.handleGetAction(data)});
	return module;
}

function UpdateModule(socketClass) {
    this.url = document.URL.split( '/' )[2] + "/websocket";
	console.log("socket at " + this.url);
	this.dispatcher = new socketClass(this.url);

    this.sendAction = function (drawActionType, startx, starty, endx, endy, color, strokeWidth) {
		var myJson = {"action": drawActionType, 
					"startx": startx, 
					"starty": starty, 
					"endx": endx, 
					"endy": endy,
					"color": color,
					"strokeWidth": strokeWidth }
		console.log("sending action..." + JSON.stringify(myJson));
        this.dispatcher.trigger('socket.send_action', JSON.stringify(myJson));
    };

    this.handleGetAction = function (data) {
		console.log("got action! it's: " + data);
		myJson = JSON.parse(data);
		this.invokeDrawingModule(myJson.action, myJson.startx, myJson.starty, myJson.endx, myJson.endy, myJson.color, myJson.strokeWidth);
    };

	this.invokeDrawingModule = function (action, startx, starty, endx, endy, color, strokeWidth) {

		switch(action) {
			case "line":
				drawLine(dispCtx, startx, starty, endx, endy, color, strokeWidth);
				break;
			case "clear":			
				clearCanvas(dispCtx);
  				break;
			case "rectangle":
				drawRectangle(dispCtx, startx, starty, endx, endy, color, strokeWidth);
				break;
			case "circle":
				drawCircle(dispCtx, startx, starty, endx, endy, color, strokeWidth);
				break;
			default:
  				console.log("invokeDrawingModule failed due to unknown action: " + action);
		}
	};

    this.getInitImg = function () {
		console.log("getting initial image...");
		this.dispatcher.trigger('socket.send_init_img', "");
    };

	this.getInitImgHandler = function (data) {
		console.log("got image, raw data is " + data);
		var myJson = JSON.parse(data);
		console.log("got image. it's: " + JSON.stringify(myJson));
		if (myJson.bitmap != "") {
			
		}
		if (myJson.actions != "") {
			var actions = myJson.actions.split(", ");
			for (var i = 0; i < actions.length; i++) {
				var thisAction = JSON.parse(actions[i]);
				console.log(JSON.stringify(thisAction));
				this.invokeDrawingModule(thisAction.action, thisAction.startx, thisAction.starty, thisAction.endx, thisAction.endy, thisAction.color, thisAction.strokeWidth);
			}
		}
	};
}
