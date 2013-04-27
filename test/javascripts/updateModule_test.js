//= require updateModule
//= require sinon-1.6.0.js
//= require uiModule

function WebSocketRailsAPIClass() {
    this.channel = null;
    this.trigger = function (arg1, arg2) {}
    this.bind = function (arg1, arg2) {}
    this.subscribe = function(arg1) { return this.channel; }
    this.setChannel = function(arg1) {this.channel = arg1;}
}

// returns [api, mock, constructor]
function mockWebSocketRails() {

    channelAPI = {
                    bind: function (arg1, arg2) {},
                    trigger: function (arg1, arg2) {}
                };

    WebSocketRailsAPI = new WebSocketRailsAPIClass();
    WebSocketRailsAPI.setChannel(channelAPI);
                                
    mock = sinon.mock(WebSocketRailsAPI);
    mock.expects("subscribe").atLeast(0).returns(channelAPI);

    fakeWebSocketRailsConstructor = sinon.stub();
	fakeWebSocketRailsConstructor.returns(WebSocketRailsAPI);

    return [WebSocketRailsAPI, mock, fakeWebSocketRailsConstructor];
}

// returns [api, mock]
function mockDrawModule() {
    fakeDrawAPI = getDrawAPI();
    mock = sinon.mock(fakeDrawAPI);

    return [fakeDrawAPI, mock];
}

function createStubAction(actionType) {
    if (actionType == "circle" || actionType == "rectangle") {
        return JSON.stringify({"action": actionType, "startx": 0, "starty": 0, "endx": 0, "endy": 0, "color": "0", "strokeWidth": 0, "fillOn": true});
    }

    return JSON.stringify({"action": actionType, "startx": 0, "starty": 0, "endx": 0, "endy": 0, "color": "0", "strokeWidth": 0});
}

module( "updateModule tests", {
	setup: function() {
        // create the this.references for the Web Socket Rails API
        var mockedWebSocketRailsPackage = mockWebSocketRails();
        this.WebSocketRailsAPI = mockedWebSocketRailsPackage[0];
        this.WebSocketRailsMock = mockedWebSocketRailsPackage[1];
        this.WebSocketRailsConstructor = mockedWebSocketRailsPackage[2];

        // modify the channel created by WebSocketRails.subscribe
        this.WebSocketRailsChannel = this.WebSocketRailsAPI.subscribe("");
        this.WebSocketRailsChannelMock = sinon.mock(this.WebSocketRailsChannel);

        // create the this.references for the Drawing Module API
        var mockedDrawModulePackage = mockDrawModule();
        this.fakeDrawModule= mockedDrawModulePackage[0];
        this.fakeDrawModuleMock = mockedDrawModulePackage[1];

        // create the this.updateModule
        this.testUpdateModule = instantiateUpdateModule(this.WebSocketRailsConstructor);
        this.testUpdateModule.setDrawAPI(this.fakeDrawModule);

        // set the canvas api as a mock
        this.canvasAPI = {toDataURL: function(arg) {return "fakefakefake"},
                          getContext: function() {return ""}};
        this.canvasAPIMock = sinon.mock(this.canvasAPI);
        this.canvasAPIMock.expects("toDataURL").atLeast(0).returns("fakefakefake");
        this.testUpdateModule.setCanvas(this.canvasAPI);

        this.testUpdateModule.initialize();
        this.testUpdateModule.stopTimer();

        this.testUpdateModule.sendActions();
	},
    
	teardown: function() {
        this.WebSocketRailsMock.restore();

        this.fakeDrawModuleMock.restore();

        this.WebSocketRailsAPI = null;
        this.WebSocketRailsMock = null;
        this.WebSocketRailsConstructor = null;

        this.fakeDrawModule= null;
        this.fakeDrawModuleMock = null;

        this.testUpdateModule = null;
;	}
});

test('instantiateUpdateModule', function() {
    fakeChannel = this.WebSocketRailsAPI.subscribe("");

    // there should be 1 bind for every type of client-server API action
    // there should be 1 subscription to the channel
    this.WebSocketRailsMock.expects("subscribe").exactly(1).returns(fakeChannel);
    this.WebSocketRailsChannelMock.expects("bind").exactly(2);

    // the WebSocketRails itself should have only 1 bind for getInitImg
    this.WebSocketRailsMock.expects("bind").exactly(1);
    this.WebSocketRailsMock.expects("trigger").exactly(0);

    // initialize, just to make sure it works
    var testUpdateModule = instantiateUpdateModule(this.WebSocketRailsConstructor);
    testUpdateModule.initialize();
    testUpdateModule.stopTimer();

    ok(testUpdateModule != null, "initialization worked as expected");
    this.WebSocketRailsMock.verify();
    this.WebSocketRailsChannelMock.verify();
});

test('updateModule.bucketAction to increase length of updateModule.bucketedActions', function() {
    var spy = sinon.spy(this.testUpdateModule, "sendActions");
    var args = ["action", "startx", "starty", "endx", "endy", "color", "strokeWidth", "fillOn"];

    var expectedActionJson = {}
    expectedActionJson["action"] = "action";
    expectedActionJson["startx"] = "startx";
    expectedActionJson["starty"] = "starty";
    expectedActionJson["endx"] = "endx";
    expectedActionJson["endy"] = "endy";
    expectedActionJson["color"] = "color";
    expectedActionJson["strokeWidth"] = "strokeWidth";
    expectedActionJson["fillOn"] = "fillOn";

    var listOfActions = new Array();

    for (var i = 0; i < 5; i++) {
        this.testUpdateModule.bucketAction(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        listOfActions[listOfActions.length-1] = expectedActionJson;
    }

    ok(spy.callCount == 0, "sendActions was not invoked since timer is not on");
    equal(this.testUpdateModule.bucketedActions.length, 5, "bucketing 5 actions made the length of the bucket 5");
    equal(JSON.stringify(expectedActionJson), this.testUpdateModule.bucketedActions[0], "actions saved in expected form");
})

test('updateModule.sendActions', function() {
    // make an expected JSON out of the args to be passed to sendAction
    var args = ["action", "startx", "starty", "endx", "endy", "color", "strokeWidth"];

    var expectedAction = {};
    for (var i = 0; i < args.length; i++) {
        expectedAction[args[i]] = args[i];
    }

    expectedActionsString = ""

    for (var i = 0; i < 3; i++) {
        this.testUpdateModule.bucketAction(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        expectedActionsString = expectedActionsString + JSON.stringify(expectedAction);
        if (i < 2) {
            expectedActionsString = expectedActionsString + ", ";
        }
    }

    var msg = {};
    msg["message"] = expectedActionsString;
    msg["canvasID"] = this.testUpdateModule.canvasID;
    msg["userCookie"] = this.testUpdateModule.userCookie;

    // expect trigger to be called once (for the send action) with the right type of event, and the expected action string
    this.WebSocketRailsMock.expects("trigger").withArgs("socket.send_action", JSON.stringify(msg)).exactly(1);

    this.testUpdateModule.sendActions();

    ok(this.WebSocketRailsMock.verify(), "verified that sendAction sent the right kind of action");
});

test('updateModule.sendActions for fillable shapes', function() {
    // make an expected JSON out of the args to be passed to sendAction
    var args = ["action", "startx", "starty", "endx", "endy", "color", "strokeWidth", "fillOn"];
    var expectedAction = {};
    for (var i = 0; i < args.length; i++) {
        expectedAction[args[i]] = args[i];
    }
    var msg = {};
    msg["message"] = JSON.stringify(expectedAction);
    msg["canvasID"] = this.testUpdateModule.canvasID;
    msg["userCookie"] = this.testUpdateModule.userCookie;

    // expect trigger to be called once (for the send action) with the right type of event, and the expected action string
    this.WebSocketRailsMock.expects("trigger").withArgs("socket.send_action", JSON.stringify(msg)).exactly(1);

    this.testUpdateModule.bucketAction(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
    this.testUpdateModule.sendActions();

    ok(this.WebSocketRailsMock.verify(), "verified that sendAction sent the right kind of action");
    equal(this.testUpdateModule.bucketedActions, null, "verified that sending the actions clears the bucketedActions list");
});

test('updateModule.handleGetActions', function() {
    var action = createStubAction("clear");
    var actionsString = action + ", " + action + ", " + action;
    var messageJson = {};
    messageJson["message"] = actionsString;
    messageJson["timestamp"] = 0;

    this.fakeDrawModuleMock.expects("clearCanvas").exactly(3);

    this.testUpdateModule.handleGetActions(JSON.stringify(messageJson));

    ok(this.fakeDrawModuleMock.verify(), "verified that getting a list of actions invokes the appropriate drawing methods");
    equal(this.testUpdateModule.lastActionTime, 0, "verified that lastActionTime was set correctly by handleGetAction");
});

test('updateModule.handleGetActions with filled object', function() {
    var action = createStubAction("circle");
    var actionJson = JSON.parse(action);
    actionsJson = {"message": action, "timestamp": 0};

    this.fakeDrawModuleMock.expects("drawCircle")
        .withArgs(this.testUpdateModule.canvas, actionJson["startx"], actionJson["starty"], actionJson["endx"], actionJson["endy"], actionJson["color"], actionJson["strokeWidth"], actionJson["fillOn"])
        .returns("").exactly(1);

    this.testUpdateModule.handleGetActions(JSON.stringify(actionsJson));

    ok(this.fakeDrawModuleMock.verify(), "verified that getting a circle action with fill on invokes drawCircle correctly");
});

test('updateModule.invokeDrawingModule all draw methods', function() {
    // test that when an action in handleGetAction maps to the correct invokeDrawingModule switch case
    var actions = ["clear", "rectangle", "circle", "line", "image", "text"];
    var actionMethods = ["clearCanvas", "drawRectangle", "drawCircle", "drawLine", "drawImageOnCanvas", "drawTextOnCanvas"];
    var actionsString = ""
    for (var i = 0; i < actions.length; i++) {
        actionsString = actionsString + createStubAction(actions[i]);
        if (actions.length > i+1) {
            actionsString = actionsString + ", ";
        }
        this.fakeDrawModuleMock.expects(actionMethods[i]).exactly(1);
    }
    actionsJson = {"message": actionsString, "timestamp":0};

    var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");

    this.testUpdateModule.handleGetActions(JSON.stringify(actionsJson));

    ok(this.fakeDrawModuleMock.verify(), "verified that getting actions invoke the appropriate DrawAPI methods");
    ok(spy.callCount == actions.length, "invokeDrawingModule called " + actions.length + " times, once per action, as expected");

    for (var i = 0; i < actions.length; i++) {
        ok(spy.calledWith(sinon.match.any, actions[i]), "invokeDrawingModule called with \"" + actions[i] + "\" as action, as expected");
    }
});

test('updateModule.getInitImg', function() {
    // make sure the method sends the correct event: socket.send_init_img
    var canvasID = 0;
    this.WebSocketRailsMock.expects("trigger").withArgs("socket.send_init_img", canvasID+"").exactly(1);
    this.testUpdateModule.getInitImg(canvasID);

    ok(this.WebSocketRailsMock.verify(), "getInitImg sent the expected socket.send_init_img event to web socket");
});

test('updateModule.invalidInitImgHandler', function() {
    var message = JSON.stringify({"bitmap": "-1", "actions": ""});
    var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");
    var failSpy = sinon.spy(this.testUpdateModule, "invalidInitImgHandler");

    this.testUpdateModule.invalidInitImgHandler();

    equal(this.testUpdateModule.dispatcher, null, "invalidInitImgHandler destroys the dispatcher, as expected");
    equal(this.testUpdateModule.timer, null, "invalidInitImgHandler destroys the timer, as expected");
    equal(this.testUpdateModule.dontSendActions, true, "invalidInitImgHandler set dontSendActions to true, as expected");
    equal(this.drawAPI, null, "invalidInitImgHandler destroys connection to drawing module, as expected");
});

test('updateModule.getInitImgHandler returns -1, no canvas exists', function() {
    var message = JSON.stringify({"bitmap": "-1", "actions": ""});
    var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");
    var failSpy = sinon.spy(this.testUpdateModule, "invalidInitImgHandler");

    this.testUpdateModule.getInitImgHandler(message);

    ok(spy.callCount == 0, "getInitImgHandler did not invoke drawing module, as expected.");
    ok(failSpy.callCount ==1, "getInitImgHandler invoked invalidInitImgHandler, as expected");
});

test('updateModule.getInitImgHandler no bitmap, no action', function() {
    // send empty init package
    var message = JSON.stringify({"bitmap": "", "actions": ""});
    var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");

    this.testUpdateModule.getInitImgHandler(message);

    ok(spy.callCount == 0, "getInitImgHandler did not invoke drawing module, as expected.");
});

test('updateModule.getInitImgHandler no bitmap, with action', function() {
    // send init package with 2 actions
    var message = JSON.stringify({"bitmap": "", "actions": ""+createStubAction("rectangle")+", "+createStubAction("clear")});

    // expect each of the 2 actions to invoke a drawing method as well as the invokeDrawingModule method
    var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");
    this.fakeDrawModuleMock.expects("drawRectangle").exactly(1);
    this.fakeDrawModuleMock.expects("clearCanvas").exactly(1);

    this.testUpdateModule.getInitImgHandler(message);

    ok(spy.callCount == 2, "getInitImgHandler called invokeDrawingModule 2 times, as expected");
    ok(this.fakeDrawModuleMock.verify(), "getInitImgHandler called the appropriate draw actions");
});

test('updateModule.getInitImgHandler with bitmap, no action', function() {
    // send init package with 1 bitmap and 2 actions
    var message = JSON.stringify({"bitmap": "fake bitmap", "actions": ""});
    var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");
    this.fakeDrawModuleMock.expects("drawBitmap").exactly(1).callsArgOn(3, this.testUpdateModule);

    this.testUpdateModule.getInitImgHandler(message);

    ok(spy.callCount == 0, "getInitImgHandler did not invokeDrawingModule, as expected");
    ok(this.fakeDrawModuleMock.verify(), "getInitImgHandler invoked drawBitmap, as expected");
});

test('updateModule.getInitImgHandler with bitmap, with actions', function() {
    // send init package with 1 bitmap and 2 actions
    var message = JSON.stringify({"bitmap": "fake bitmap", "actions": ""+createStubAction("rectangle")+", "+createStubAction("clear")});
    var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");
    var drawActionsSpy = sinon.spy(this.testUpdateModule, "drawInitActions");
    this.fakeDrawModuleMock.expects("drawBitmap").exactly(1).callsArgOn(3, this.testUpdateModule);
    this.fakeDrawModuleMock.expects("drawRectangle").exactly(1);
    this.fakeDrawModuleMock.expects("clearCanvas").exactly(1);

    this.testUpdateModule.getInitImgHandler(message);

    ok(spy.callCount == 2, "getInitImgHandler invoked drawing module twice, as expected");
    ok(drawActionsSpy.callCount == 1, "drawInitActions was called, as expected");
    ok(this.fakeDrawModuleMock.verify(), "getInitImgHandler invoked drawBitmap and appropriate drawingModule methods, as expected");
});

test('updateModule.drawInitActions with initActions', function() {
    var actionsList = [createStubAction("rectangle"),createStubAction("clear")];
    var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");
    this.fakeDrawModuleMock.expects("drawRectangle").exactly(1);
    this.fakeDrawModuleMock.expects("clearCanvas").exactly(1);

    this.testUpdateModule.initActions = actionsList;
    this.testUpdateModule.drawInitActions();

    ok(spy.callCount == 2, "drawInitActions invoked drawing module twice, as expected");
    ok(this.fakeDrawModuleMock.verify(), "drawInitActions invoked correct drawing actions");
});

test('updateModule.sendBitmap', function() {
    this.canvasAPIMock.expects("toDataURL").exactly(1).returns("fakefakefake");
    this.WebSocketRailsMock.expects("trigger").exactly(1);

    this.testUpdateModule.sendBitmap();

    ok(this.canvasAPIMock.verify(), "sendBitmap called canvas.toDataURL once, as expected");
    ok(this.WebSocketRailsMock.verify(), "the sendBitmap method triggers a message as well as calls canvas.toDataURL");
});

test('updateModule.sendAction+handleGetAction multiple times to trigger sendBitmap', function() {
    var spy = sinon.spy(this.testUpdateModule, "sendBitmap");
    this.fakeDrawModuleMock.expects("clearCanvas").atLeast(0).returns();
    this.fakeDrawModuleMock.expects("drawRectangle").atLeast(0).returns();
    this.fakeDrawModuleMock.expects("drawLine").atLeast(0).returns();

    this.testUpdateModule.setActionsLimit(20);
    var message = JSON.stringify({"message": createStubAction("clear")+", "+createStubAction("rectangle")+", "+createStubAction("line"), "timestamp": 0});
    for (var i = 0; i < 7; i++) {
        this.testUpdateModule.handleGetActions(message);
    }

    ok(spy.callCount == 1, "sendAction and handleGetAction 55 times with actionsLimit as 30 results in 1 sendBitmap, as expected");
})

test('updateModule.handleSentBitmap', function() {
    this.testUpdateModule.actionsCount = 50;
    this.testUpdateModule.handleSentBitmap();
    equal(this.testUpdateModule.actionsCount, 0, "handleSentBitmap set actionsCount to 0, as expected");
})