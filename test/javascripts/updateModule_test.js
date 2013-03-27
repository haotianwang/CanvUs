//= require updateModule
//= require sinon-1.6.0.js

module( "updateModule tests", {
	setup: function() {
        this.WebSocketRailsAPI = {   
                                    trigger: function (arg1, arg2) {},
                                    bind: function (arg1, arg2) {} 
                                };

        this.mock = sinon.mock(this.WebSocketRailsAPI);
        this.mock.expects("trigger").atLeast(0).returns();
        this.mock.expects("bind").atLeast(1).returns();

    	this.fakeWebSocketRailsConstructor = sinon.stub();
		this.fakeWebSocketRailsConstructor.returns(this.WebSocketRailsAPI);
	},
	teardown: function() {
		this.WebSocketRailsAPI = null;
        this.mock = null;
	}
});

test('initialize updateModule', function() {
    var testUpdateModule = instantiateUpdateModule(this.fakeWebSocketRailsConstructor);
    ok(testUpdateModule != null, "initialization worked as expected");
    this.mock.verify();
});