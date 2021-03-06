//welcomeModule
var canvasButton1,
	dispCanvas,
	dispCtx, imageData;

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
	}

	/*//This creates a new div, and adds "hello" and then puts it as the last thing
	//under body
	var newDiv = document.createElement("div");
	newDiv.id = "testDiv";
	newDiv.innerHTML = "hello";
	document.getElementById("body").appendChild(newDiv);
	//*/
	
	var htmlBody = document.getElementById("body");
	//get a string representing every available canvas delimited by '|'
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","canvases",false);
	xmlhttp.send();
	//var test = "{\"canvases\",\"1|2|3\"}";
	//console.log("response: " + test.split("\"")[3]);//xmlhttp.responseText.split("\"")[3] + " " + xmlhttp.responseText.length);


	var strOfCanvases = xmlhttp.responseText.split("\"")[3];//getText();//updateModule.getCanvasesAvailable();
	//split the string by '|'
	var arrOfCanvases = strOfCanvases.split("|");
	console.log(arrOfCanvases);
	//for each available canvas
	if(arrOfCanvases.length == 1 && arrOfCanvases[0] == "")
		return;
	for(var i = 0; i < arrOfCanvases.length; i++) {
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
		htmlBody.appendChild(newCanv);

		/*//doesn't really work... the paragraph works like a break...
		//add a one space paragraph between canvases
		var oneSpaceParagraph = document.createElement("p");
		oneSpaceParagraph.innerHTML = "&nbsp;";
		htmlBody.appendChild(oneSpaceParagraph);
		//*/

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

	//console.log(newCanv.getContext("2d").getImageData(0,0, newCanv.width, newCanv.height).data);
	//console.log(newCanv.getContext("2d").getImageData(0,0, newCanv.width, newCanv.height).data.length);
	//console.log(newCanv.getContext("2d").getImageData(0,0, newCanv.width, newCanv.height).data.toString());
	//var tempImg = new Image();
	//tempImg.src = newCanv.toDataURL("image/png")//.toString();
	//console.log(tempImg);
	//console.log(tempImg.src);
	//document.getElementById("canvas0").getContext("2d").drawImage(tempImg,0,0);
	//htmlBody.appendChild(tempImg);
	//console.log("here");
	//console.log(newCanv.getContext("2d").getImageData(0,0, newCanv.width, newCanv.height).data.toString().split());
}
