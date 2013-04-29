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

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function instantiateUpdateModule(socketClass) {
    var module = new UpdateModule();
    module.setSocketClass(socketClass);
    module.resetDefaults();

    return module;
}

function UpdateModule() {
    // general config
    this.socketClass = null;
    this.dispatcher = null;
    this.DrawAPI = null;
    this.context = null;
    this.canvas = null;
    this.userCookie = null;
    this.canvasID = null;
    this.channel = null;
    this.debug = true;

    // send action config
    this.sendActionsTimeInterval = 100;
    this.dontSendActions = false;
    this.timer = null;
    this.bucketedActions = null;

    // send bitmap config
    this.actionsLimit = 1000;
    this.actionsCount = 0;
    this.lastActionTime = null;

    // getInitImg config
    this.initActions = null;

    this.resetDefaults = function() {
        this.setDrawAPI(getDrawAPI());
        this.setContext(dispCtx);
        this.setCanvas(dispCanvas);

        this.setCanvasID(-1);
        canvasID = getURLParameter("canvasId");
        if (canvasID != null) {
            this.setCanvasID(canvasID);
        }
        if (this.debug) console.log("canvasID of updateModule is " + this.canvasID);
        this.setUserCookie(-1);
    }

    this.initialize = function() {
        this.url = document.URL.split( '/' )[2] + "/websocket";
        if (this.debug) console.log("socket at " + this.url);
        this.dispatcher = new this.socketClass(this.url);
        this.channel = this.dispatcher.subscribe(this.canvasID+'');

        var module = this;

        this.dispatcher.bind('socket.get_init_img', function(data) {module.getInitImgHandler(data)});
        this.channel.bind('socket.get_action', function(data) {module.handleGetActions(data)});
        this.channel.bind('socket.sent_bitmap', function(data) {module.handleSentBitmap()});
    }

    this.setActionsLimit = function(limit) {
        this.actionsLimit = limit;
    }

    this.setUserCookie = function (userCookie) {
        this.userCookie = userCookie;
    }

    this.setCanvasID = function (canvasID) {
        this.canvasID = canvasID;
    }

    this.setContext = function (context) {
        this.context = context;
    }

    this.setCanvas = function (canvas) {
        this.canvas = canvas;
        if(canvas != null)
            this.context = canvas.getContext("2d");
    }

    this.setSocketClass = function(socketClass) {
        this.socketClass = socketClass;
    }

    this.setDrawAPI = function (API) {
        this.DrawAPI = API;
    }

    this.startTimer = function () {
        this.timer = new Date().getTime();
    }

    this.stopTimer = function () {
        this.timer = null;
    }

    this.bucketAction = function(drawActionType, startx, starty, endx, endy, color, strokeWidth, fillOn) {
        var myActionJson = {
            "action": drawActionType, 
            "startx": startx, 
            "starty": starty, 
            "endx": endx, 
            "endy": endy,
            "color": color,
            "strokeWidth": strokeWidth };
        if (fillOn != null) {
            myActionJson["fillOn"] = fillOn;
        }

        if (this.bucketedActions == null) {
            this.bucketedActions = new Array();
        }

        if (this.debug) console.log("bucketing action: " + JSON.stringify(myActionJson));

        this.bucketedActions[this.bucketedActions.length] = JSON.stringify(myActionJson);

        if (this.timer != null) {
            if (new Date().getTime() - this.timer > this.sendActionsTimeInterval) {
                this.sendActions();
                this.timer = new Date().getTime();
            }
        }
    }

    this.sendActions = function () {
        if (this.debug) console.log("sendActions called");
        if (this.dontSendActions || this.bucketedActions == null || this.bucketedActions.length == 0) {
            return;
        }
        var bucketedActionsHolder = this.bucketedActions;
        this.bucketedActions = null;

        var actionsString = "";
        for (var i = 0; i < bucketedActionsHolder.length; i++) {
            actionsString = actionsString + bucketedActionsHolder[i];
            if (i+1 < bucketedActionsHolder.length) actionsString = actionsString + ", ";
        }

        var messageJson = {};
        messageJson["message"] = actionsString;
        messageJson["canvasID"] = this.canvasID;
        messageJson["userCookie"] = this.userCookie;
        if (this.debug) console.log("sending actions. total of " + bucketedActionsHolder.length + " actions...");

        this.dispatcher.trigger('socket.send_action', JSON.stringify(messageJson));
    }

    this.sendBitmap = function () {
        bitmap = this.canvas.toDataURL("image/png").toString();
        myMsgJson = { "bitmap": bitmap };
        myMsgJson["canvasID"] = this.canvasID;
        myMsgJson["timestamp"] = this.lastActionTime;
        this.dispatcher.trigger('socket.send_bitmap', JSON.stringify(myMsgJson));
        if (this.debug) console.log("just sent updated bitmap! it was " + JSON.stringify(myMsgJson));
    }

    this.handleGetActions = function (data) {
        if (this.debug) console.log("got actions! parsing...");
        myJson = JSON.parse(data);
        actionsString = myJson.message;
        timestamp = myJson.timestamp;

        listOfActions = actionsString.split(", ");

        if (this.debug) console.log("actions are: " + listOfActions);

        for (i = 0; i < listOfActions.length; i++) {
            this.handleGetAction(listOfActions[i]);
        }

        this.lastActionTime = timestamp;

        if (this.actionsCount >= this.actionsLimit) {
            this.actionsCount = 0;
            this.sendBitmap();
        }
    }

    this.handleGetAction = function (data) {
        myJson = JSON.parse(data);
        
        if (this.debug) console.log("handleGetAction drawing: " + data);
        this.invokeDrawingModule(this.canvas, myJson.action, myJson.startx, myJson.starty, myJson.endx, myJson.endy, myJson.color, myJson.strokeWidth, myJson.fillOn);
        this.actionsCount = this.actionsCount + 1;
    };

    this.invokeDrawingModule = function (canvas, action, startx, starty, endx, endy, color, strokeWidth, fillOn) {
        switch(action) {
            case "line":
                this.DrawAPI.drawLine(canvas, startx, starty, endx, endy, color, strokeWidth);
                break;
            case "clear":
                this.DrawAPI.clearCanvas(canvas);
                break;
            case "rectangle":
                this.DrawAPI.drawRectangle(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn);
                break;
            case "circle":
                this.DrawAPI.drawCircle(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn);
                break;
            case "image":
                this.DrawAPI.drawImageOnCanvas(canvas, color, startx, starty);
                break;
            case "text":
                this.DrawAPI.drawTextOnCanvas(canvas, color, startx, starty);
                break;
            default:
                if (this.debug) console.log("invokeDrawingModule failed due to unknown action: " + action);
        }
    };

    this.getInitImg = function (canvasID) {
        if (this.debug) console.log("getting initial image...");
        this.dispatcher.trigger('socket.send_init_img', "" + canvasID);
    };

    this.getInitImgHandler = function (data) {
        if (this.debug) console.log("got image, raw data is " + data);
        var myJson = JSON.parse(data);
        if (myJson.bitmap == "-1" || myJson.bitmap == -1) {
            this.invalidInitImgHandler();
            return;
        }

        if (this.debug) console.log("got image. it's: " + JSON.stringify(myJson));
        // add received actions to this.initActions. Will be used by drawInitActions during callback of drawBitmap
        if (myJson.actions != "") {
            var actions = myJson.actions.split(", ");
            if (this.debug) console.log("parsed actions is " + actions); 
            //this.initActions should be empty when initImg is first received, otherwise where did initActions come from?
            if (this.initActions == null) {
                this.initActions = actions;
            }
            else {
                if (this.debug) console.log("ERROR: updateModule.initActions is not null when getInitImgHandler is invoked");
            }
        }
        // draw the bitmap if one exists (with the drawInitActions callback when it's done), or just draw initActions
        if (myJson.bitmap != "") {
            this.DrawAPI.drawBitmap(this.canvas, myJson.bitmap, this, this.drawInitActions);
        }
        else {
            this.drawInitActions();
        }
    };

    this.invalidInitImgHandler = function () {
        if (this.debug) console.log("invalid initImg! breaking everything!");
        this.dispatcher = null;
        this.dontSendActions = true;
        this.stopTimer();
        this.drawAPI = null;
    }

    this.drawInitActions = function () {
        if (this.debug) console.log("drawInitActions: initActions is " + this.initActions);

        if (this.initActions == null) {
            if (this.debug) console.log("drawInitActions called, but initActions is null!");
            return;
        }

        if (this.debug) console.log("drawing initial actions..");
        iters = this.initActions.length;
        for (var i = 0; i < iters; i++) {
            var thisAction = JSON.parse(this.initActions.shift());
            if (this.debug) console.log("drawing " + JSON.stringify(thisAction));

            if (thisAction.action == "image") {
                this.DrawAPI.drawImageOnCanvas(this.canvas, thisAction.color, thisAction.startx, thisAction.starty, this, this.drawInitActions);
                return;
            } else {
                this.invokeDrawingModule(this.canvas, thisAction.action, thisAction.startx, thisAction.starty, thisAction.endx, thisAction.endy, thisAction.color, thisAction.strokeWidth, thisAction.fillOn);
            }
        }
        if (this.debug) console.log("done drawing initial actions!");

        this.initActions = null;
    }

    this.handleSentBitmap = function () {
        this.actionsCount = 0;
        if (this.debug) console.log("server says bitmap has been sent already");
    }
}



function getDrawAPI() {
    API = {
        drawLine: function(canvas, startx, starty, endx, endy, color, strokeWidth) { 
            drawLine(canvas, startx, starty, endx, endy, color, strokeWidth); 
        },
            
        clearCanvas: function(canvas) { 
            clearCanvas(canvas); 
        },

        drawRectangle: function(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn) { 
            drawRectangle(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn); 
        },

        drawCircle: function(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn) { 
            drawCircle(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn); 
        },

        drawBitmap: function(canvas, bitmap, callbackObject, callbackFunction) {
            drawBitmap(canvas, bitmap, callbackObject, callbackFunction);
        },

        drawImageOnCanvas: function(canvas, bitmap, canvX, canvY, callbackObject, callbackFunction) {
            drawImageOnCanvas(canvas, bitmap, canvX, canvY, callbackObject, callbackFunction);
        },

        drawTextOnCanvas: function(canvas, text, canvX, canvY) {
            drawTextOnCanvas(canvas, text, canvX, canvY);
        }
    }
    return API;
}