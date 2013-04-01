/*
The UpdateModule class will incorporate all of the functionality of the Update Module. 
the function names directly map to the functionality that the Update Module must have.
- UpdateModule.sendAction(DrawActionType, startx, starty, endx, endy, color, strokeWidth)
    - DrawActionTypes supported (string): "rect", "circle", "line", "clear"
    - "clear" DrawActionType ignores other arguments
    - "line" DrawActionType also covers the "pencil" tool, since the pencil just draws a bunch of lines
- UpdateModule.handleGetAction(data)
- updateModule.getInitImg()

INITIALIZATION:
    module = instantiateUpdateModule(socketClass);
    ...optional...
    module.setDrawAPI(api);
    module.setContext(context);
    module.setCanvas(id);
    module.setCanvasID(int);
    module.setUserCookie(cookie);
    ...
    module.initialize();
*/

function instantiateUpdateModule(socketClass) {
    var module = new UpdateModule();
    module.setSocketClass(socketClass);
    module.setDrawAPI(getDrawAPI());
    module.setContext(dispCtx);
    module.setCanvas(dispCanvas);
    module.setCanvasID(-1);
    module.setUserCookie(-1);

    return module;
}

function UpdateModule() {
    this.socketClass = null;
    this.dispatcher = null;
    this.DrawAPI = null;
    this.context = null;
    this.canvas = null;
    this.userCookie = null;
    this.canvasID = null;
    this.channel = null;

    this.initialize = function() {
        this.url = document.URL.split( '/' )[2] + "/websocket";
        console.log("socket at " + this.url);
        this.dispatcher = new this.socketClass(this.url);
        this.channel = this.dispatcher.subscribe(this.canvasID+'');

        var module = this;

        this.dispatcher.bind('socket.get_init_img', function(data) {module.getInitImgHandler(data)});
        this.channel.bind('socket.get_action', function(data) {module.handleGetAction(data)});
    }

    this.setUserCookie = function (userCookie) {
        this.userCookie = userCookie;
    }

    this.setCanvasID = function (canvasID) {
        this.canvasId = canvasID;
    }

    this.setContext = function (context) {
        this.context = context;
    }

    this.setCanvas = function (canvas) {
        this.canvas = canvas;
    }

    this.setSocketClass = function(socketClass) {
        this.socketClass = socketClass;
    }

    this.setDrawAPI = function (API) {
        this.DrawAPI = API;
    }

    this.sendAction = function (drawActionType, startx, starty, endx, endy, color, strokeWidth) {
        var myActionJson = {
                    "action": drawActionType, 
                    "startx": startx, 
                    "starty": starty, 
                    "endx": endx, 
                    "endy": endy,
                    "color": color,
                    "strokeWidth": strokeWidth }
        var myMsgJson = { "message": myActionJson };
        myMsgJson["canvasID"] = this.canvasID;
        myMsgJson["userCookie"] = this.userCookie;
        console.log("sending action..." + JSON.stringify(myMsgJson));
        this.dispatcher.trigger('socket.send_action', JSON.stringify(myMsgJson));
    };

    this.handleGetAction = function (data) {
        console.log("got action! it's: " + data);
        myJson = JSON.parse(data);
        this.invokeDrawingModule(dispCtx, myJson.action, myJson.startx, myJson.starty, myJson.endx, myJson.endy, myJson.color, myJson.strokeWidth);
    };

    this.invokeDrawingModule = function (context, action, startx, starty, endx, endy, color, strokeWidth) {
        switch(action) {
            case "line":
                this.DrawAPI.drawLine(context, startx, starty, endx, endy, color, strokeWidth);
                break;
            case "clear":           
                this.DrawAPI.clearCanvas(context);
                break;
            case "rectangle":
                this.DrawAPI.drawRectangle(context, startx, starty, endx, endy, color, strokeWidth);
                break;
            case "circle":
                this.DrawAPI.drawCircle(context, startx, starty, endx, endy, color, strokeWidth);
                break;
            default:
                console.log("invokeDrawingModule failed due to unknown action: " + action);
        }
    };

    this.getInitImg = function (canvasID) {
        console.log("getting initial image...");
        this.dispatcher.trigger('socket.send_init_img', ""+canvasID);
    };

    this.getInitImgHandler = function (data) {
        console.log("got image, raw data is " + data);
        var myJson = JSON.parse(data);
        console.log("got image. it's: " + JSON.stringify(myJson));
        if (myJson.bitmap != "") {
            this.DrawAPI.drawBitmap(this.canvas, myJson.bitmap);
        }
        if (myJson.actions != "") {
            var actions = myJson.actions.split(", ");
            for (var i = 0; i < actions.length; i++) {
                var thisAction = JSON.parse(actions[i]);
                console.log(JSON.stringify(thisAction));
                this.invokeDrawingModule(this.context, thisAction.action, thisAction.startx, thisAction.starty, thisAction.endx, thisAction.endy, thisAction.color, thisAction.strokeWidth);
            }
        }
    };
}

function getDrawAPI() {
    API = {
        drawLine: function(dispCtx, startx, starty, endx, endy, color, strokeWidth) { 
            drawLine(dispCtx, startx, starty, endx, endy, color, strokeWidth); 
        },
            
        clearCanvas: function(dispCtx) { 
            clearCanvas(dispCtx); 
        },

        drawRectangle: function(dispCtx, startx, starty, endx, endy, color, strokeWidth) { 
            drawRectangle(dispCtx, startx, starty, endx, endy, color, strokeWidth); 
        },

        drawCircle: function(dispCtx, startx, starty, endx, endy, color, strokeWidth) { 
            drawCircle(dispCtx, startx, starty, endx, endy, color, strokeWidth); 
        },

        drawBitmap: function(canvas, bitmap) {
            drawBitmap(canvas, bitmap);
        }
    }
    return API;
}