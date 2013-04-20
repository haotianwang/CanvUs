
function instantiateChatUpdateModule(canvas, channelName) {
    chatUpdateModule = new ChatUpdateModule(canvas);
    chatUpdateModule.setChannelName(channelName);
    chatUpdateModule.initialize();
}

function ChatUpdateModule(canvas) {
    // general config
    this.socketClass = WebSocketRails;
    this.dispatcher = null;
    this.chatAPI = getChatAPI();
    this.context = null;
    this.canvas = canvas||null;
    this.userCookie = null;
    this.channel = null;
    this.channelName = null;
    this.debug = true;

    this.initialize = function() {
        this.url = document.URL.split( '/' )[2] + "/websocket";
        if (this.debug) console.log("socket at " + this.url);
        this.dispatcher = new this.socketClass(this.url);
        this.channel = this.dispatcher.subscribe(this.channelName);

        var module = this;

        this.channel.bind('socket.get_text', function(data) {module.handleGetText(data)});
    }

    this.setChannelName = function (name) {
        this.channelName = name;
    }

    this.setCanvas = function (canvas) {
        this.canvas = canvas;
        if(canvas != null)
            this.context = canvas.getContext("2d");
    }

    this.setSocketClass = function(socketClass) {
        this.socketClass = socketClass;
    }

    this.setChatAPI = function (API) {
        this.chatAPI = API;
    }

    this.sendText = function (textString) {
        this.channel.trigger('socket.get_text', textString);
    }

    this.handleGetText = function (data) {
        this.chatAPI.drawText(this.canvas, data);
    };
}

function getChatAPI() {
    API = {
        drawText: function(canvas, text) {
            drawText(canvas, text);
        }
    }
    return API;
}