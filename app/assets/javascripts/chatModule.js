var chatCanvas,
textInTextBox = [''],
numLetDict = ['0','1','2','3','4','5','6','7','8','9',
              'a','b','c','d','e','f','g','h','i','j',
              'k','l','m','n','o','p','q','r','s','t',
              'u','v','w','x','y','z'],
dummyVar,
uploadedImage = new Image(),
okayButton,
chatBoxName,
chatBoxText,
updateModule, 
randomID = Math.floor(Math.random()*1000000),
numberOfLines = 29;

function initialize() {//** create new update module **
	updateModule = instantiateChatUpdateModule(document.getElementById("chatCanvas"), "text");

	chatCanvas = document.getElementById("chatCanvas");
	//updateModule.setCanvas(chatCanvas);
	chatBoxName = document.getElementById("chat-box-name");
	chatBoxText = document.getElementById("chat-box-text");
};

function printText() {
	var newText = chatBoxName.value + ": " + chatBoxText.value
	//No longer print your own message, send it to the updateModule and only print
	// when it gets back to you, which means no more need for randomID
	/*textInTextBox.push(newText);
	if(textInTextBox.length > numberOfLines) {
		textInTextBox = textInTextBox.splice(1,textInTextBox.length);
	}*/
	//this will split strings that are too long
	for(var i = 0; i < newText.length; i+= 96) {
		if(i + 96 > newText.length) {
			updateModule.sendText(/*randomID + */newText.substring(i, newText.length));
		} else {
			updateModule.sendText(newText.substring(i, i+96));
		}
	}
	chatBoxText.value = '';
	/*
	clearCanvas(chatCanvas);
	for(var i = 0; i < textInTextBox.length; i++) {
        drawTextOnCanvas(chatCanvas, textInTextBox[i], 15, 15+i*15);
    }*/
};

function drawText(canvas, text) {
	//Just print after you recieve it, so no longer need to figure out who is who via
	//random number generator
	//if(randomID != text.substring(0,text.indexOf(chatBoxName.value))) {
		textInTextBox.push(text.substring(text.indexOf(chatBoxName.value), text.length));
		if(textInTextBox.length > numberOfLines) {
			textInTextBox = textInTextBox.splice(1,textInTextBox.length);
		}
	//}
	
	clearCanvas(chatCanvas);
	for(var i = 0; i < textInTextBox.length; i++) {
        drawTextOnCanvas(chatCanvas, textInTextBox[i], 15, 15+i*15);
    }
}