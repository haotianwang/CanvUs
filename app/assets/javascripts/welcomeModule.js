//welcomeModule
var canvasButton1,
	dispCanvas,
	dispCtx, imageData,
	arrOfCanvases,
	backButton,
	numOfCanvasOnPage = 6,
	//the VARIABLE pageId is Zero-Indexed 
	//  whereas the URL parameter is One-Indexed
	pageId = 0,
	numOfCanvasPages = 1;

function getText() {
	return "0|12|34|2|5|3";
}

function initialize() {
	//set the onclicklistener for create room
	createRoomButton = document.getElementById("createRoomButton");
	createRoomButton.onclick = function() {
		url = "/new_canvas"
		$.ajax({
        url: url,
        dataType: 'html',
        error: function(data) {console.log("new canvas request failed");}
    	}).done(function(data) {
    		console.log("new canvas request response received");
    		dataJson = JSON.parse(data);
    		data = dataJson.canvasID
			if (isNaN(parseInt(data))) {
				console.log("new canvas request returned a nonInteger: " + data);
			} else {
				console.log("new canvas request returned an id: " + data);
				newUrl = '/draw?canvasId='+parseInt(data);
				window.location = newUrl;
			}
      	});
      	return false; //so the page doesn't try to reload
	}

	//Parse the pageId url parameter and set it to the pageId variable
	// url paramter pageId starts at 1, so -1 to start it at 0
	//***** DISCUSSION!!!!!! ****
	pageId = getURLParameter("pageId");
	if (pageId == null ) { //case with no param
		pageId = 0;
	} else if(isNaN(pageId)){ //case where param is NaN
		window.location.href = "http://" + window.location.host + "/?pageId=" + 1;
		//return so it doesn't load anymore
		return;
	} else {
		pageId = parseInt(pageId, 10) - 1;
		//if user tries to go to pageId 0 or less, send them to the first page 
		// (which is 1 in terms of url paramters, but 0 in variables)
		if (pageId < 0) {
			window.location.href = "http://" + window.location.host + "/?pageId=" + 1;
			//return so it doesn't load anymore
			return;
		}
	} 
	console.log("pageId is: " + pageId);

	var htmlBody = document.getElementById("body");
	var canvasLinksDiv = document.getElementById("canvas-links-div");
	var pageControlDiv = document.getElementById("page-control-div");
	var pageNumberTextDiv = document.getElementById("page-number-text-div");
	backButton = document.getElementById('back-button');
	//get a string representing every available canvas delimited by '|'
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","canvases",false);
	xmlhttp.send();
	//var test = "{\"canvases\",\"1|2|3\"}";
	//console.log("response: " + test.split("\"")[3]);//xmlhttp.responseText.split("\"")[3] + " " + xmlhttp.responseText.length);

	var strOfCanvases = xmlhttp.responseText.split("\"")[3];//getText();//updateModule.getCanvasesAvailable();
	//split the string by '|'
	if(strOfCanvases == "") {
		arrOfCanvases = [];
	} else {
		arrOfCanvases = strOfCanvases.split("|");
		console.log(arrOfCanvases);
	}

	//calculate number of pages:button
	if(arrOfCanvases.length != 0) {
		numOfCanvasPages = Math.floor((arrOfCanvases.length - 1)/numOfCanvasOnPage) + 1;
	}

	//if user tries to access a pageID > numOfCanvasPages
	// the case where pageID < 1 is handled when we parse the url parameter
	if(pageId + 1 > numOfCanvasPages) {
		window.location.href = "http://" + window.location.host + "/?pageId=" + numOfCanvasPages;
		//return so it doesn't load anymore of the page
		return;
	} 

	for(var i = pageId * numOfCanvasOnPage; i < numOfCanvasOnPage*(pageId+1) && i < arrOfCanvases.length; i++) {
		console.log("i is: " + i + " arrOfCanvases.length: " + arrOfCanvases.length);
		console.log(arrOfCanvases);
		//create a div
		var newCanv = document.createElement("canvas");
		//create a new updateModule each time, because if you don't 
		// the getInitImage logic is too slow and only draws on the last canvas
		updateModule = instantiateUpdateModule(WebSocketRails);
		newCanv.id = "canvas" + i;
		console.log(newCanv.id);
		newCanv.width = "1000";
		newCanv.height = "500";
		newCanv.style.cssText = "width:500px;height:250px;border:1px solid #000000";
		canvasLinksDiv.appendChild(newCanv);

		//set canvas and context of updateModule then initialize
		//updateModule.setContext(newCanv.getContext("2d"));
		updateModule.setCanvas(newCanv);
		updateModule.initialize();

		//call getInitImg: still needs to inclide the canvasID
		updateModule.getInitImg(arrOfCanvases[i]);

		//set onclick event of canvas to http:// + host + /draw + reference to canvID from the input array
		//wrapping the function in another function to store context
		newCanv.onclick = function(iString) {
			return function() {
				window.location.href = "http://" + window.location.host + "/draw?canvasId=" + iString;
				return false;
			};
		}(arrOfCanvases[i]);
	}

	//append page number stuff to the page-control-div
	if(pageId != 0) {
		var prevPageButton = document.createElement("input");
		prevPageButton.id = "prev-page-button";
		prevPageButton.type = "submit";
		prevPageButton.value = "<";
		//set the url
		prevPageButton.onclick = function(currentPage) {
			return function() {
				window.location.href = "http://" + window.location.host + "/?pageId=" + (parseInt(currentPage,10)-1);
				return false;
			};
		}(pageId + 1);
		//add the button to the page-control-div
		$('#page-control-div').append(prevPageButton);
	}

	var pageNumber = " Page: " + (pageId + 1) + " of " + numOfCanvasPages + " ";
	$('#page-control-div').append(pageNumber);

	backButton.onclick = function() {
        //okay room for logic. Should the back button take you back to the original page?
        //or should it take you back to the page the canvus is on? 
        window.location.href = "http://" + window.location.host;
    }

	if(pageId+1 < numOfCanvasPages) {
		var nextPageButton = document.createElement("input");
		nextPageButton.id = "next-page-button";
		nextPageButton.type = "submit";
		nextPageButton.value = ">";
		pageControlDiv.appendChild(nextPageButton);

		nextPageButton.onclick = function(currentPage) {
			return function() {
				window.location.href = "http://" + window.location.host + "/?pageId=" + (parseInt(currentPage,10)+1);
				return false;
			};
		}(pageId + 1);

		//$('page-control-div').append(nextPageButton);
	}

	var pageJumpDiv = document.getElementById("page-jump-div");

	var jumpPageTextBox, jumpPageButton;

	jumpPageTextBox = document.createElement("input");
	jumpPageTextBox.id = "jump-page-text-box";
	jumpPageTextBox.type = "text";
	jumpPageTextBox.style.width = "20px";
	jumpPageTextBox.style.height = "15px";
	pageJumpDiv.appendChild(jumpPageTextBox);

	jumpPageButton = document.createElement("input");
	jumpPageButton.id = "jump-page-button";
	jumpPageButton.type = "submit";
	jumpPageButton.value = "Jump To Page";
	pageJumpDiv.appendChild(jumpPageButton);

	//logic for the jumpPageTextBox and jumpPageButton here
	jumpPageTextBox.onkeydown = function (event) {
		if(event.keyCode == 13) {
			//only check for enter
			if(!jumpToPage(jumpPageTextBox.value)) {
				alert("Please enter a number");
				jumpPageTextBox.value = "";
			}
		}
	}

	jumpPageButton.onclick = function (event) {
		if(!jumpToPage(jumpPageTextBox.value)) {
			alert("Please enter a number");
			jumpPageTextBox.value = "";
		}
		return false;
	}

	//This methods takes a string and jumps to the page denoted by it
	// returns false if unsuccessful, true if successful
	function jumpToPage(text) {
		if(isNaN(text)) { //invalid page number, not a number
			return false; //means there's an error with input
		}
		else if(parseInt(text) > numOfCanvasPages) {
			window.location.href = "http://" + window.location.host + "/?pageId=" + numOfCanvasPages;
			return true;
		} else if (parseInt(text) <= numOfCanvasPages) {
			window.location.href = "http://" + window.location.host + "/?pageId=" + parseInt(text);
			return true;
		} else {
			//unknown error
			return false;
		}
	}

	var roomJumpTextBox, roomJumpButton;

	roomJumpTextBox = document.getElementById("room-jump-text-box");
	roomJumpButton = document.getElementById("room-jump-button");

	roomJumpTextBox.onkeydown = function (event) {
		if(event.keyCode == 13) {
			//only check for enter
			if(!jumpToRoom(roomJumpTextBox.value)) {
				roomJumpTextBox.value = "";
			}
		}
	}

	roomJumpButton.onclick = function (event) {
		if(!jumpToRoom(roomJumpTextBox.value)) {
			roomJumpTextBox.value = "";
		}
		return false;
	}

	function jumpToRoom(text) {
		if(isNaN(text)) { //invalid page number, not a number
			alert("Please enter a number");
			return false; //means there's an error with input
		} else if(arrOfCanvases.indexOf(text) == -1) {
		 	console.log("Input is: " + text);
		 	console.log(arrOfCanvases.indexOf(text))
		 	alert("Room doesn't exist. Please try again or create another room.")
			return false;
		} else if(arrOfCanvases.indexOf(text) != -1){
			window.location.href = "http://" + window.location.host + "/draw?canvasId=" + parseInt(text);
			return true;
		} else {
			//unknown error
			return false;
		}
	}
}
