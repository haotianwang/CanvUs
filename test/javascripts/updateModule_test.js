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
	},
    
	teardown: function() {
        this.WebSocketRailsMock.restore();

        this.fakeDrawModuleMock.restore();

        this.WebSocketRailsAPI = null;
        this.WebSocketRailsMock = null;
        this.WebSocketRailsConstructor = null;

        this.fakeDrawModule= null;
        this.fakeDrawModuleMock = null;

        this.testUpdateModule = null
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

    ok(testUpdateModule != null, "initialization worked as expected");
    this.WebSocketRailsMock.verify();
    this.WebSocketRailsChannelMock.verify();
});

test('updateModule.sendAction', function() {
    // make an expected JSON out of the args to be passed to sendAction
    var args = ["action", "startx", "starty", "endx", "endy", "color", "strokeWidth"];
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

    this.testUpdateModule.sendAction(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);

    ok(this.WebSocketRailsMock.verify(), "verified that sendAction sent the right kind of action");
});

test('updateModule.handleGetAction', function() {
    // make the action to send to updateModule
    var action = createStubAction("clear");
    action["timestamp"] = 0;
    // this action should invoke clearCanvas exactly once
    this.fakeDrawModuleMock.expects("clearCanvas").returns("").exactly(1);

    this.testUpdateModule.handleGetAction(action);

    ok(this.fakeDrawModuleMock.verify(), "verified that getting a clear action invokes the clearCanvas DrawAPI method");
});

test('updateModule.invokeDrawingModule all draw methods', function() {
    // test that when an action in handleGetAction maps to the correct invokeDrawingModule switch case
    var actions = ["clear", "rectangle", "circle", "line"];
    var actionMethods = ["clearCanvas", "drawRectangle", "drawCircle", "drawLine"];
    for (var i = 0; i < actions.length; i++) {
        this.setup();

        // make action to be sent
        var action = createStubAction(actions[i]);
        // expect ith DrawAPI method to be invoked
        this.fakeDrawModuleMock.expects(actionMethods[i]).exactly(1);
        // spy on testUpdateModule.invokeDrawingModule to make sure it's called correctly
        var spy = sinon.spy(this.testUpdateModule, "invokeDrawingModule");

        this.testUpdateModule.handleGetAction(action);

        ok(this.fakeDrawModuleMock.verify(), "verified that getting a " + actions[i] + " action invokes the " + actionMethods[i] + " DrawAPI method");
        ok(spy.callCount == 1, "invokeDrawingModule called once, as expected");
        ok(spy.calledWith(sinon.match.any, actions[i]), "invokeDrawingModule called with \"" + actions[i] + "\" as action, as expected");

        if (i < actions.length-1){
            this.teardown();
        }
    }
});

test('updateModule.getInitImg', function() {
    // make sure the method sends the correct event: socket.send_init_img
    var canvasID = 0;
    this.WebSocketRailsMock.expects("trigger").withArgs("socket.send_init_img", canvasID+"").exactly(1);
    this.testUpdateModule.getInitImg(canvasID);

    ok(this.WebSocketRailsMock.verify(), "getInitImg sent the expected socket.send_init_img event to web socket");
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
    this.fakeDrawModuleMock.expects("drawBitmap").exactly(1);

    this.testUpdateModule.getInitImgHandler(message);

    ok(spy.callCount == 0, "getInitImgHandler did not invokeDrawingModule, as expected");
    ok(this.fakeDrawModuleMock.verify(), "getInitImgHandler invoked drawBitmap, as expected");
});

test('updateModule.sendBitmap', function() {
    this.canvasAPIMock.expects("toDataURL").exactly(1).returns("fakefakefake");
    this.WebSocketRailsMock.expects("trigger").exactly(1);

    this.testUpdateModule.sendBitmap();

    this.canvasAPIMock.verify();
    ok(this.WebSocketRailsMock.verify(), "the sendBitmap method triggers a message as well as calls canvas.toDataURL");
});

test('updateModule.sendAction+handleGetAction multiple times to trigger sendBitmap', function() {
    var spy = sinon.spy(this.testUpdateModule, "sendBitmap");
    this.fakeDrawModuleMock.expects("clearCanvas").atLeast(0).returns();

    this.testUpdateModule.setActionsLimit(30);
    for (i = 0; i < 55; i++) {
        this.testUpdateModule.handleGetAction(createStubAction("clear"));
    }

    ok(spy.callCount == 1, "sendAction and handleGetAction 55 times with actionsLimit as 30 results in 1 sendBitmap, as expected");
})

test('updateModule.handleSentBitmap', function() {
    this.testUpdateModule.actionsCount = 50;
    this.testUpdateModule.handleSentBitmap();
    equal(this.testUpdateModule.actionsCount, 0, "handleSentBitmap set actionsCount to 0, as expected");
})