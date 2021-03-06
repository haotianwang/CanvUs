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
    this.socketClass = null;
    this.dispatcher = null;
    this.DrawAPI = null;
    this.context = null;
    this.canvas = null;
    this.userCookie = null;
    this.canvasID = null;
    this.channel = null;
    this.sendActionsTimeInterval = 1000;
    this.lastActionTime = null;
    this.actionsLimit = 300;
    this.actionsCount = 0;
    this.initActions = null;
    this.dontSendActions = false;
    this.timer = null;

    this.resetDefaults = function() {
        this.setDrawAPI(getDrawAPI());
        this.setContext(dispCtx);
        this.setCanvas(dispCanvas);

        this.setCanvasID(-1);
        canvasID = getURLParameter("canvasId");
        if (canvasID != null) {
            this.setCanvasID(canvasID);
        }
        this.setUserCookie(-1);
    }

    this.initialize = function() {
        this.url = document.URL.split( '/' )[2] + "/websocket";
        console.log("socket at " + this.url);
        this.dispatcher = new this.socketClass(this.url);
        this.channel = this.dispatcher.subscribe(this.canvasID+'');

        var module = this;

        this.dispatcher.bind('socket.get_init_img', function(data) {module.getInitImgHandler(data)});
        this.channel.bind('socket.get_action', function(data) {module.handleGetAction(data)});
        this.channel.bind('socket.sent_bitmap', function(data) {module.handleSentBitmap()});

        this.startTimer();
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
        var module = this;
        this.timer = setInterval(module.sendActions, this.sendActionsTimeInterval);
    }

    this.stopTimer = function () {
        if (this.timer != null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    this.sendAction = function (drawActionType, startx, starty, endx, endy, color, strokeWidth, fillOn) {
        if(this.dontSendActions) {
            console.log("didn't send action")
            return;
        }
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
        var myMsgJson = { "message": JSON.stringify(myActionJson) };
        myMsgJson["canvasID"] = this.canvasID;
        myMsgJson["userCookie"] = this.userCookie;
        console.log("sending action..." + JSON.stringify(myMsgJson));

        this.dispatcher.trigger('socket.send_action', JSON.stringify(myMsgJson));
    }

    this.sendActions = function () {

    }

    this.sendBitmap = function () {
        bitmap = this.canvas.toDataURL("image/png").toString();
        myMsgJson = { "bitmap": bitmap };
        myMsgJson["canvasID"] = this.canvasID;
        myMsgJson["timestamp"] = this.lastActionTime;
        this.dispatcher.trigger('socket.send_bitmap', JSON.stringify(myMsgJson));
        console.log("just sent updated bitmap! it was " + JSON.stringify(myMsgJson));
    }

    this.handleGetAction = function (data) {
        myJson = JSON.parse(data);

        this.invokeDrawingModule(this.canvas, myJson.action, myJson.startx, myJson.starty, myJson.endx, myJson.endy, myJson.color, myJson.strokeWidth, myJson.fillOn);
        this.actionsCount = this.actionsCount + 1;
        if (this.actionsCount >= this.actionsLimit) {
            this.actionsCount = 0;
            this.sendBitmap();
        }
    };

    this.handleGetActions = function (data) {
        console.log("got actions! parsing...");
        myJson = JSON.parse(data);
        actionsString = myJson.message;
        timestamp = myJson.timestamp;

        listOfActions = actionsString.split("},{");
        if (listOfActions.length > 1) {
            for (i = 0; i < listOfActions.length; i++) {
                if (i == 0) {
                    listOfActions[i] = listOfActions[i] + "}";
                }
                else if (i == listOfActions.length-1) {
                    listOfActions[i] = "{" + listOfActions[i];
                }
                else {
                    listOfActions[i] = "{" + listOfActions[i] + "}";
                }
            }

            for (i = 0; i < listOfActions.length; i++) {
                console.log("got action: " + listOfActions[i]);
            }
        }
        else {
            listOfActions = [actionsString];
        }

        for (i = 0; i < listOfActions.length; i++) {
            this.handleGetAction(listOfActions[i]);
        }

        this.lastActionTime = timestamp;
    }

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
            default:
                console.log("invokeDrawingModule failed due to unknown action: " + action);
        }
    };

    this.getInitImg = function (canvasID) {
        console.log("getting initial image...");
        this.dispatcher.trigger('socket.send_init_img', "" + canvasID);
    };

    this.getInitImgHandler = function (data) {
        console.log("got image, raw data is " + data);
        var myJson = JSON.parse(data);
        console.log("got image. it's: " + JSON.stringify(myJson));
        // add received actions to this.initActions. Will be used by drawInitActions during callback of drawBitmap
        if (myJson.actions != "") {
            var actions = myJson.actions.split(", ");
            console.log("parsed actions is " + actions); 
            //this.initActions should be empty when initImg is first received, otherwise where did initActions come from?
            if (this.initActions == null) {
                this.initActions = actions;
            }
            else {
                console.log("ERROR: updateModule.initActions is not null when getInitImgHandler is invoked");
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

    this.drawInitActions = function () {
        console.log("drawInitActions: initActions is " + this.initActions);

        if (this.initActions == null) {
            console.log("drawInitActions called, but initActions is null!");
            return;
        }

        console.log("drawing initial actions..");
        for (var i = 0; i < this.initActions.length; i++) {
           var thisAction = JSON.parse(this.initActions[i]);
            console.log("drawing " + JSON.stringify(thisAction));
            this.invokeDrawingModule(this.canvas, thisAction.action, thisAction.startx, thisAction.starty, thisAction.endx, thisAction.endy, thisAction.color, thisAction.strokeWidth, thisAction.fillOn);
        }
        console.log("done drawing initial actions!");

        this.initActions = null;
    }

    this.handleSentBitmap = function () {
        this.actionsCount = 0;
        console.log("server says bitmap has been sent already");
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
        }
    }
    return API;
}