function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '[]'
    }
    var array = [];
    var length = branchData.length;
    for (var line = 0; line < length; line++) {
        var branchDataObject = branchData[line];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = convertBranchDataConditionArrayToJSON(branchDataObject);
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return [];
    }
    var length = jsonObject.length;
    for (var line = 0; line < length; line++) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
  return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
    switch (c) {
    case '\b':
      return '\\b';
    case '\f':
      return '\\f';
    case '\n':
      return '\\n';
    case '\r':
      return '\\r';
    case '\t':
      return '\\t';
    // IE doesn't support this
    /*
    case '\v':
      return '\\v';
    */
    case '"':
      return '\\"';
    case '\\':
      return '\\\\';
    default:
      return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
    }
  }) + '"';
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['welcomeModule.js']) {
  _$jscoverage['welcomeModule.js'] = {};
  _$jscoverage['welcomeModule.js'].lineData = [];
  _$jscoverage['welcomeModule.js'].lineData[2] = 0;
  _$jscoverage['welcomeModule.js'].lineData[6] = 0;
  _$jscoverage['welcomeModule.js'].lineData[7] = 0;
  _$jscoverage['welcomeModule.js'].lineData[10] = 0;
  _$jscoverage['welcomeModule.js'].lineData[12] = 0;
  _$jscoverage['welcomeModule.js'].lineData[13] = 0;
  _$jscoverage['welcomeModule.js'].lineData[14] = 0;
  _$jscoverage['welcomeModule.js'].lineData[18] = 0;
  _$jscoverage['welcomeModule.js'].lineData[19] = 0;
  _$jscoverage['welcomeModule.js'].lineData[20] = 0;
  _$jscoverage['welcomeModule.js'].lineData[21] = 0;
  _$jscoverage['welcomeModule.js'].lineData[22] = 0;
  _$jscoverage['welcomeModule.js'].lineData[23] = 0;
  _$jscoverage['welcomeModule.js'].lineData[24] = 0;
  _$jscoverage['welcomeModule.js'].lineData[26] = 0;
  _$jscoverage['welcomeModule.js'].lineData[27] = 0;
  _$jscoverage['welcomeModule.js'].lineData[28] = 0;
  _$jscoverage['welcomeModule.js'].lineData[41] = 0;
  _$jscoverage['welcomeModule.js'].lineData[43] = 0;
  _$jscoverage['welcomeModule.js'].lineData[44] = 0;
  _$jscoverage['welcomeModule.js'].lineData[45] = 0;
  _$jscoverage['welcomeModule.js'].lineData[50] = 0;
  _$jscoverage['welcomeModule.js'].lineData[52] = 0;
  _$jscoverage['welcomeModule.js'].lineData[53] = 0;
  _$jscoverage['welcomeModule.js'].lineData[55] = 0;
  _$jscoverage['welcomeModule.js'].lineData[56] = 0;
  _$jscoverage['welcomeModule.js'].lineData[57] = 0;
  _$jscoverage['welcomeModule.js'].lineData[59] = 0;
  _$jscoverage['welcomeModule.js'].lineData[62] = 0;
  _$jscoverage['welcomeModule.js'].lineData[63] = 0;
  _$jscoverage['welcomeModule.js'].lineData[64] = 0;
  _$jscoverage['welcomeModule.js'].lineData[65] = 0;
  _$jscoverage['welcomeModule.js'].lineData[66] = 0;
  _$jscoverage['welcomeModule.js'].lineData[67] = 0;
  _$jscoverage['welcomeModule.js'].lineData[68] = 0;
  _$jscoverage['welcomeModule.js'].lineData[79] = 0;
  _$jscoverage['welcomeModule.js'].lineData[80] = 0;
  _$jscoverage['welcomeModule.js'].lineData[83] = 0;
  _$jscoverage['welcomeModule.js'].lineData[87] = 0;
  _$jscoverage['welcomeModule.js'].lineData[88] = 0;
  _$jscoverage['welcomeModule.js'].lineData[89] = 0;
  _$jscoverage['welcomeModule.js'].lineData[90] = 0;
}
if (! _$jscoverage['welcomeModule.js'].branchData) {
  _$jscoverage['welcomeModule.js'].branchData = [];
  _$jscoverage['welcomeModule.js'].branchData[23] = [];
  _$jscoverage['welcomeModule.js'].branchData[23][1] = new BranchData();
  _$jscoverage['welcomeModule.js'].branchData[55] = [];
  _$jscoverage['welcomeModule.js'].branchData[55][1] = new BranchData();
  _$jscoverage['welcomeModule.js'].branchData[55][2] = new BranchData();
  _$jscoverage['welcomeModule.js'].branchData[55][3] = new BranchData();
  _$jscoverage['welcomeModule.js'].branchData[57] = [];
  _$jscoverage['welcomeModule.js'].branchData[57][1] = new BranchData();
}
_$jscoverage['welcomeModule.js'].branchData[57][1].init(1690, 24, 'i < arrOfCanvases.length');
function visit75_57_1(result) {
  _$jscoverage['welcomeModule.js'].branchData[57][1].ranCondition(result);
  return result;
}_$jscoverage['welcomeModule.js'].branchData[55][3].init(1640, 22, 'arrOfCanvases[0] == ""');
function visit74_55_3(result) {
  _$jscoverage['welcomeModule.js'].branchData[55][3].ranCondition(result);
  return result;
}_$jscoverage['welcomeModule.js'].branchData[55][2].init(1611, 25, 'arrOfCanvases.length == 1');
function visit73_55_2(result) {
  _$jscoverage['welcomeModule.js'].branchData[55][2].ranCondition(result);
  return result;
}_$jscoverage['welcomeModule.js'].branchData[55][1].init(1611, 51, 'arrOfCanvases.length == 1 && arrOfCanvases[0] == ""');
function visit72_55_1(result) {
  _$jscoverage['welcomeModule.js'].branchData[55][1].ranCondition(result);
  return result;
}_$jscoverage['welcomeModule.js'].branchData[23][1].init(133, 21, 'isNaN(parseInt(data))');
function visit71_23_1(result) {
  _$jscoverage['welcomeModule.js'].branchData[23][1].ranCondition(result);
  return result;
}_$jscoverage['welcomeModule.js'].lineData[2]++;
var canvasButton1, dispCanvas, dispCtx, imageData;
_$jscoverage['welcomeModule.js'].lineData[6]++;
function getText() {
  _$jscoverage['welcomeModule.js'].lineData[7]++;
  return "0|12|34|2|5|3";
}
_$jscoverage['welcomeModule.js'].lineData[10]++;
function initialize() {
  _$jscoverage['welcomeModule.js'].lineData[12]++;
  createRoomButton = document.getElementById("createRoomButton");
  _$jscoverage['welcomeModule.js'].lineData[13]++;
  createRoomButton.onclick = function() {
  _$jscoverage['welcomeModule.js'].lineData[14]++;
  url = "/new_canvas";
  _$jscoverage['welcomeModule.js'].lineData[19]++;
  $.ajax({
  url: url, 
  dataType: 'html', 
  error: function(data) {
  _$jscoverage['welcomeModule.js'].lineData[18]++;
  console.log("new canvas request failed");
}}).done(function(data) {
  _$jscoverage['welcomeModule.js'].lineData[20]++;
  console.log("new canvas request response received");
  _$jscoverage['welcomeModule.js'].lineData[21]++;
  dataJson = JSON.parse(data);
  _$jscoverage['welcomeModule.js'].lineData[22]++;
  data = dataJson.canvasID;
  _$jscoverage['welcomeModule.js'].lineData[23]++;
  if (visit71_23_1(isNaN(parseInt(data)))) {
    _$jscoverage['welcomeModule.js'].lineData[24]++;
    console.log("new canvas request returned a nonInteger: " + data);
  } else {
    _$jscoverage['welcomeModule.js'].lineData[26]++;
    console.log("new canvas request returned an id: " + data);
    _$jscoverage['welcomeModule.js'].lineData[27]++;
    newUrl = '/draw?canvasId=' + parseInt(data);
    _$jscoverage['welcomeModule.js'].lineData[28]++;
    window.location = newUrl;
  }
});
};
  _$jscoverage['welcomeModule.js'].lineData[41]++;
  var htmlBody = document.getElementById("body");
  _$jscoverage['welcomeModule.js'].lineData[43]++;
  var xmlhttp = new XMLHttpRequest();
  _$jscoverage['welcomeModule.js'].lineData[44]++;
  xmlhttp.open("GET", "canvases", false);
  _$jscoverage['welcomeModule.js'].lineData[45]++;
  xmlhttp.send();
  _$jscoverage['welcomeModule.js'].lineData[50]++;
  var strOfCanvases = xmlhttp.responseText.split("\"")[3];
  _$jscoverage['welcomeModule.js'].lineData[52]++;
  var arrOfCanvases = strOfCanvases.split("|");
  _$jscoverage['welcomeModule.js'].lineData[53]++;
  console.log(arrOfCanvases);
  _$jscoverage['welcomeModule.js'].lineData[55]++;
  if (visit72_55_1(visit73_55_2(arrOfCanvases.length == 1) && visit74_55_3(arrOfCanvases[0] == ""))) {
    _$jscoverage['welcomeModule.js'].lineData[56]++;
    return;
  }
  _$jscoverage['welcomeModule.js'].lineData[57]++;
  for (var i = 0; visit75_57_1(i < arrOfCanvases.length); i++) {
    _$jscoverage['welcomeModule.js'].lineData[59]++;
    var newCanv = document.createElement("canvas");
    _$jscoverage['welcomeModule.js'].lineData[62]++;
    updateModule = instantiateUpdateModule(WebSocketRails);
    _$jscoverage['welcomeModule.js'].lineData[63]++;
    newCanv.id = "canvas" + i;
    _$jscoverage['welcomeModule.js'].lineData[64]++;
    console.log(newCanv.id);
    _$jscoverage['welcomeModule.js'].lineData[65]++;
    newCanv.width = "1000";
    _$jscoverage['welcomeModule.js'].lineData[66]++;
    newCanv.height = "500";
    _$jscoverage['welcomeModule.js'].lineData[67]++;
    newCanv.style.cssText = "width:500px;height:250px;border:1px solid #000000";
    _$jscoverage['welcomeModule.js'].lineData[68]++;
    htmlBody.appendChild(newCanv);
    _$jscoverage['welcomeModule.js'].lineData[79]++;
    updateModule.setCanvas(newCanv);
    _$jscoverage['welcomeModule.js'].lineData[80]++;
    updateModule.initialize();
    _$jscoverage['welcomeModule.js'].lineData[83]++;
    updateModule.getInitImg(arrOfCanvases[i]);
    _$jscoverage['welcomeModule.js'].lineData[87]++;
    newCanv.onclick = function(iString) {
  _$jscoverage['welcomeModule.js'].lineData[88]++;
  return function() {
  _$jscoverage['welcomeModule.js'].lineData[89]++;
  window.location.href = "http://" + window.location.host + "/draw?canvasId=" + iString;
  _$jscoverage['welcomeModule.js'].lineData[90]++;
  return false;
};
}(arrOfCanvases[i]);
  }
}
