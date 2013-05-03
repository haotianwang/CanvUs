var chatUpdateModule,
chatBox,
chatBoxName,
chatBoxText,
chatButton,
chatIsVisible,
textInTextBox = [''], 
numberOfLines = 100;

function initializeChat(canvasID) {//** create new update module **
	chatUpdateModule = instantiateChatUpdateModule(document.getElementById("chatBox"), "chat" + canvasID);

	chatBox = document.getElementById("chatBox")
	chatBoxName = document.getElementById("chat-box-name");
	chatBoxText = document.getElementById("chat-box-text");
	chatButton = document.getElementById("chat-button");
	chatButton.onclick = function() {
	if (chatIsVisible) {
		$("#chatBox").hide("slide", { direction: "right" }, 180);
		$("#text-entry-fields").hide("slide", { direction: "right"}, 180);
		chatIsVisible = false;
	}
	else {
		$("#chatBox").show("slide", { direction: "right" }, 180);
		$("#text-entry-fields").show("slide", { direction: "right"}, 180);
		chatIsVisible = true;
	}
  return false;
  };
	$("#chatBox").hide();
	$("#text-entry-fields").hide();
	chatIsVisible = false;
};

function printText() {
	var newText = "<b>" + chatBoxName.value + "</b>: " + chatBoxText.value
	//this will split strings that are too long
	if (chatBoxName.value.length > 16) {
		chatBoxName.value = chatBoxName.value.substring(0, 17);
	}

	chatUpdateModule.sendText("<b>" + chatBoxName.value + "</b>: " + chatBoxText.value.substring(0, 16-chatBoxName.value.length));

	newText = chatBoxText.value.substring(16-chatBoxName.value.length, chatBoxText.value.length);

	for(var i = 0; i < newText.length; i+= 18) {
		if(i + 18 > newText.length) {
			chatUpdateModule.sendText(newText.substring(i, newText.length));
		} else {
			chatUpdateModule.sendText(newText.substring(i, i+18));
		}
	}
	chatBoxText.value = '';
};

function displayText(text) {
	//Just print after you recieve it, so no longer need to figure out who is who via
	//random number generator
	textInTextBox.push(text);
	if(textInTextBox.length > numberOfLines) {
		textInTextBox = textInTextBox.splice(1,textInTextBox.length);
	}
	
	$("#chatBox").text("");
	for(var i = 0; i < textInTextBox.length; i++) {
    	$("#chatBox").append("<p>" + textInTextBox[i]);
  	}
  	$("#chatBox").scrollTop(this.chatBox.scrollHeight);
}