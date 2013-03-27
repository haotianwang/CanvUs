//= require updateModule
//= require sinon-1.6.0.js

function mockWebSocketRails() {
    this.WebSocketRailsAPI = {   
                                trigger: function (arg1, arg2) {},
                                bind: function (arg1, arg2) {} 
                             };
                                
    this.mock = sinon.mock(this.WebSocketRailsAPI);

    this.fakeWebSocketRailsConstructor = sinon.stub();
	this.fakeWebSocketRailsConstructor.returns(this.WebSocketRailsAPI);
}

function mockUIModule() {

}

module( "module A", {
	setup: function() {
        this.WebSocketRailsAPI = {   
                                    trigger: function (arg1, arg2) {},
                                    bind: function (arg1, arg2) {} 
                                };
                                
        this.mock = sinon.mock(this.WebSocketRailsAPI);

    	this.fakeWebSocketRailsConstructor = sinon.stub();
		this.fakeWebSocketRailsConstructor.returns(this.WebSocketRailsAPI);
	},
    
	teardown: function() {
		this.WebSocketRailsAPI = null;
        this.mock = null;
        this.fakeWebSocketsRailsConstructor = null;
	}
});

test('initialize updateModule', function() {
    var testUpdateModule = instantiateUpdateModule(this.fakeWebSocketRailsConstructor);
    ok(testUpdateModule != null, "initialization worked as expected");
    this.mock.verify();
});

test('initialize updateModule', function() {
    this.mock.expects("trigger").atLeast(0).returns();
    this.mock.expects("bind").atLeast(1).returns();
    var testUpdateModule = instantiateUpdateModule(this.fakeWebSocketRailsConstructor);
    ok(testUpdateModule != null, "initialization worked as expected");
    this.mock.verify();
});