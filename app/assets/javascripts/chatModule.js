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
randomID = Math.floor(Math.random()*1000000);

function initialize() {//** create new update module **
	updateModule = instantiateChatUpdateModule(document.getElementById("chatCanvas"), "text");

	chatCanvas = document.getElementById("chatCanvas");
	//updateModule.setCanvas(chatCanvas);
	chatBoxName = document.getElementById("chat-box-name");
	chatBoxText = document.getElementById("chat-box-text");

    /*
    document.onkeydown = function (event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if(charCode >= 48 && charCode <= 57) {
            textInTextBox[textInTextBox.length-1] += numLetDict[charCode-48];
        }
        else if(charCode >= 96 && charCode <= 105){
            textInTextBox[textInTextBox.length-1] += numLetDict[charCode-96];
        }
        else if(charCode >= 65 && charCode <= 90 ) {
            textInTextBox[textInTextBox.length-1] += numLetDict[charCode-55];
        }
        else if(charCode == 32) {
            textInTextBox[textInTextBox.length-1] += ' ';
        }
        /*
        else if(charCode == 8) {
            if(textInTextBox[textInTextBox.length-1].length > 0){
                textInTextBox[textInTextBox.length-1] = textInTextBox[textInTextBox.length-1].substring(0, textInTextBox[textInTextBox.length-1].length-1)
            }
            else if (textInTextBox.length > 1){
                textInTextBox.pop();
            }
        }
        else if(charCode == 13) {
            textInTextBox.push('');
        }*/
        //clearCanvas(chatCanvas);
        /*for(var i = 0; i < textInTextBox.length; i++) {
            drawTextOnCanvas(chatCanvas, textInTextBox[i], uploadedImage.canvX, uploadedImage.canvY+i*15);
        }
        console.log(charCode);
        console.log(textInTextBox);
    };
    */
};

function printText() {
	var newText = chatBoxName.value + ": " + chatBoxText.value
	textInTextBox.push(newText);
	updateModule.sendText(randomID + newText);
	chatBoxText.value = '';
	clearCanvas(chatCanvas);
	for(var i = 0; i < textInTextBox.length; i++) {
        drawTextOnCanvas(chatCanvas, textInTextBox[i], 15, 15+i*15);
    }
};

function drawText(canvas, text) {
	if(randomID != text.substring(0,text.indexOf(chatBoxName.value))) {
		textInTextBox.push(text.substring(text.indexOf(chatBoxName.value), text.length));
	}
	clearCanvas(chatCanvas);
	for(var i = 0; i < textInTextBox.length; i++) {
        drawTextOnCanvas(chatCanvas, textInTextBox[i], 15, 15+i*15);
    }
}