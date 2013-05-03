
function instantiateChatUpdateModule(chatBox, channelName) {
    chatUpdateModule = new ChatUpdateModule(chatBox);
    chatUpdateModule.setChannelName(channelName);
    chatUpdateModule.initialize();
    return chatUpdateModule;
}

function ChatUpdateModule(chatBox) {
    // general config
    this.socketClass = WebSocketRails;
    this.dispatcher = null;
    this.chatAPI = getChatAPI();
    this.chatBox = chatBox||null;
    this.userCookie = null;
    this.channel = null;
    this.channelName = null;
    this.debug = false;

    this.initialize = function() {
        this.url = document.URL.split( '/' )[2] + "/websocket";
        if (this.debug) console.log("socket at " + this.url);
        this.dispatcher = new this.socketClass(this.url);
        this.channel = this.dispatcher.subscribe(this.channelName);
        var module = this;

        this.channel.bind('socket.get_text', function(data) {module.handleGetText(data)});
    }

    this.setSocketClass = function(socketClass) {
        this.socketClass = socketClass;
    }

    this.setChannelName = function (name) {
        this.channelName = name;
    }

    this.setChatAPI = function (API) {
        this.chatAPI = API;
    }

    this.setChatBox = function (chatBox) {
        this.chatBox = chatBox;
    }

    this.sendText = function (text) {
        this.channel.trigger('socket.get_text', text);
    }

    this.handleGetText = function (data) {
        this.chatAPI.displayText(data);
    };
}

function getChatAPI() {
    API = {
        displayText: function(text) {
            displayText(text);
        }
    }
    return API;
}