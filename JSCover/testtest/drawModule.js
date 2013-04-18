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
if (! _$jscoverage['drawModule.js']) {
  _$jscoverage['drawModule.js'] = {};
  _$jscoverage['drawModule.js'].lineData = [];
  _$jscoverage['drawModule.js'].lineData[4] = 0;
  _$jscoverage['drawModule.js'].lineData[6] = 0;
  _$jscoverage['drawModule.js'].lineData[7] = 0;
  _$jscoverage['drawModule.js'].lineData[8] = 0;
  _$jscoverage['drawModule.js'].lineData[9] = 0;
  _$jscoverage['drawModule.js'].lineData[10] = 0;
  _$jscoverage['drawModule.js'].lineData[11] = 0;
  _$jscoverage['drawModule.js'].lineData[12] = 0;
  _$jscoverage['drawModule.js'].lineData[13] = 0;
  _$jscoverage['drawModule.js'].lineData[14] = 0;
  _$jscoverage['drawModule.js'].lineData[16] = 0;
  _$jscoverage['drawModule.js'].lineData[19] = 0;
  _$jscoverage['drawModule.js'].lineData[20] = 0;
  _$jscoverage['drawModule.js'].lineData[21] = 0;
  _$jscoverage['drawModule.js'].lineData[22] = 0;
  _$jscoverage['drawModule.js'].lineData[24] = 0;
  _$jscoverage['drawModule.js'].lineData[25] = 0;
  _$jscoverage['drawModule.js'].lineData[27] = 0;
  _$jscoverage['drawModule.js'].lineData[28] = 0;
  _$jscoverage['drawModule.js'].lineData[29] = 0;
  _$jscoverage['drawModule.js'].lineData[30] = 0;
  _$jscoverage['drawModule.js'].lineData[31] = 0;
  _$jscoverage['drawModule.js'].lineData[32] = 0;
  _$jscoverage['drawModule.js'].lineData[36] = 0;
  _$jscoverage['drawModule.js'].lineData[37] = 0;
  _$jscoverage['drawModule.js'].lineData[38] = 0;
  _$jscoverage['drawModule.js'].lineData[40] = 0;
  _$jscoverage['drawModule.js'].lineData[41] = 0;
  _$jscoverage['drawModule.js'].lineData[42] = 0;
  _$jscoverage['drawModule.js'].lineData[43] = 0;
  _$jscoverage['drawModule.js'].lineData[46] = 0;
  _$jscoverage['drawModule.js'].lineData[47] = 0;
  _$jscoverage['drawModule.js'].lineData[54] = 0;
  _$jscoverage['drawModule.js'].lineData[55] = 0;
  _$jscoverage['drawModule.js'].lineData[56] = 0;
  _$jscoverage['drawModule.js'].lineData[57] = 0;
  _$jscoverage['drawModule.js'].lineData[58] = 0;
  _$jscoverage['drawModule.js'].lineData[60] = 0;
  _$jscoverage['drawModule.js'].lineData[61] = 0;
  _$jscoverage['drawModule.js'].lineData[63] = 0;
  _$jscoverage['drawModule.js'].lineData[64] = 0;
  _$jscoverage['drawModule.js'].lineData[68] = 0;
}
if (! _$jscoverage['drawModule.js'].branchData) {
  _$jscoverage['drawModule.js'].branchData = [];
  _$jscoverage['drawModule.js'].branchData[12] = [];
  _$jscoverage['drawModule.js'].branchData[12][1] = new BranchData();
  _$jscoverage['drawModule.js'].branchData[30] = [];
  _$jscoverage['drawModule.js'].branchData[30][1] = new BranchData();
  _$jscoverage['drawModule.js'].branchData[60] = [];
  _$jscoverage['drawModule.js'].branchData[60][1] = new BranchData();
  _$jscoverage['drawModule.js'].branchData[60][2] = new BranchData();
  _$jscoverage['drawModule.js'].branchData[60][3] = new BranchData();
  _$jscoverage['drawModule.js'].branchData[63] = [];
  _$jscoverage['drawModule.js'].branchData[63][1] = new BranchData();
  _$jscoverage['drawModule.js'].branchData[63][2] = new BranchData();
  _$jscoverage['drawModule.js'].branchData[63][3] = new BranchData();
}
_$jscoverage['drawModule.js'].branchData[63][3].init(240, 24, 'callbackFunction != null');
function visit27_63_3(result) {
  _$jscoverage['drawModule.js'].branchData[63][3].ranCondition(result);
  return result;
}_$jscoverage['drawModule.js'].branchData[63][2].init(214, 22, 'callbackObject == null');
function visit26_63_2(result) {
  _$jscoverage['drawModule.js'].branchData[63][2].ranCondition(result);
  return result;
}_$jscoverage['drawModule.js'].branchData[63][1].init(214, 50, 'callbackObject == null && callbackFunction != null');
function visit25_63_1(result) {
  _$jscoverage['drawModule.js'].branchData[63][1].ranCondition(result);
  return result;
}_$jscoverage['drawModule.js'].branchData[60][3].init(128, 24, 'callbackFunction != null');
function visit24_60_3(result) {
  _$jscoverage['drawModule.js'].branchData[60][3].ranCondition(result);
  return result;
}_$jscoverage['drawModule.js'].branchData[60][2].init(102, 22, 'callbackObject != null');
function visit23_60_2(result) {
  _$jscoverage['drawModule.js'].branchData[60][2].ranCondition(result);
  return result;
}_$jscoverage['drawModule.js'].branchData[60][1].init(102, 50, 'callbackObject != null && callbackFunction != null');
function visit22_60_1(result) {
  _$jscoverage['drawModule.js'].branchData[60][1].ranCondition(result);
  return result;
}_$jscoverage['drawModule.js'].branchData[30][1].init(402, 6, 'fillOn');
function visit21_30_1(result) {
  _$jscoverage['drawModule.js'].branchData[30][1].ranCondition(result);
  return result;
}_$jscoverage['drawModule.js'].branchData[12][1].init(273, 6, 'fillOn');
function visit20_12_1(result) {
  _$jscoverage['drawModule.js'].branchData[12][1].ranCondition(result);
  return result;
}_$jscoverage['drawModule.js'].lineData[4]++;
function drawRectangle(canvas, startx, starty, endx, endy, color, lineWidth, fillOn) {
  _$jscoverage['drawModule.js'].lineData[6]++;
  var x = Math.min(startx, endx);
  _$jscoverage['drawModule.js'].lineData[7]++;
  var y = Math.min(starty, endy);
  _$jscoverage['drawModule.js'].lineData[8]++;
  var w = Math.abs(startx - endx);
  _$jscoverage['drawModule.js'].lineData[9]++;
  var h = Math.abs(starty - endy);
  _$jscoverage['drawModule.js'].lineData[10]++;
  canvas.getContext("2d").strokeStyle = color;
  _$jscoverage['drawModule.js'].lineData[11]++;
  canvas.getContext("2d").lineWidth = lineWidth;
  _$jscoverage['drawModule.js'].lineData[12]++;
  if (visit20_12_1(fillOn)) {
    _$jscoverage['drawModule.js'].lineData[13]++;
    canvas.getContext("2d").fillStyle = color;
    _$jscoverage['drawModule.js'].lineData[14]++;
    canvas.getContext("2d").fillRect(x, y, w, h);
  }
  _$jscoverage['drawModule.js'].lineData[16]++;
  canvas.getContext("2d").strokeRect(x, y, w, h);
}
_$jscoverage['drawModule.js'].lineData[19]++;
function drawCircle(canvas, startx, starty, endx, endy, color, lineWidth, fillOn) {
  _$jscoverage['drawModule.js'].lineData[20]++;
  var midX = (startx + endx) / 2;
  _$jscoverage['drawModule.js'].lineData[21]++;
  var midY = (starty + endy) / 2;
  _$jscoverage['drawModule.js'].lineData[22]++;
  var radius = Math.sqrt(Math.pow(endx - midX, 2) + Math.pow(endy - midY, 2));
  _$jscoverage['drawModule.js'].lineData[24]++;
  canvas.getContext("2d").strokeStyle = color;
  _$jscoverage['drawModule.js'].lineData[25]++;
  canvas.getContext("2d").lineWidth = lineWidth;
  _$jscoverage['drawModule.js'].lineData[27]++;
  canvas.getContext("2d").beginPath();
  _$jscoverage['drawModule.js'].lineData[28]++;
  canvas.getContext("2d").arc(midX, midY, radius, 0, Math.PI * 2, false);
  _$jscoverage['drawModule.js'].lineData[29]++;
  canvas.getContext("2d").stroke();
  _$jscoverage['drawModule.js'].lineData[30]++;
  if (visit21_30_1(fillOn)) {
    _$jscoverage['drawModule.js'].lineData[31]++;
    canvas.getContext("2d").fillStyle = color;
    _$jscoverage['drawModule.js'].lineData[32]++;
    canvas.getContext("2d").fill();
  }
}
_$jscoverage['drawModule.js'].lineData[36]++;
function drawLine(canvas, startx, starty, endx, endy, color, lineWidth) {
  _$jscoverage['drawModule.js'].lineData[37]++;
  canvas.getContext("2d").strokeStyle = color;
  _$jscoverage['drawModule.js'].lineData[38]++;
  canvas.getContext("2d").lineWidth = lineWidth;
  _$jscoverage['drawModule.js'].lineData[40]++;
  canvas.getContext("2d").beginPath();
  _$jscoverage['drawModule.js'].lineData[41]++;
  canvas.getContext("2d").moveTo(startx, starty);
  _$jscoverage['drawModule.js'].lineData[42]++;
  canvas.getContext("2d").lineTo(endx, endy);
  _$jscoverage['drawModule.js'].lineData[43]++;
  canvas.getContext("2d").stroke();
}
_$jscoverage['drawModule.js'].lineData[46]++;
function clearCanvas(canvas) {
  _$jscoverage['drawModule.js'].lineData[47]++;
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}
_$jscoverage['drawModule.js'].lineData[54]++;
function drawBitmap(canvas, imageData, callbackObject, callbackFunction) {
  _$jscoverage['drawModule.js'].lineData[55]++;
  var imageToLoad = new Image();
  _$jscoverage['drawModule.js'].lineData[56]++;
  imageToLoad.onload = function() {
  _$jscoverage['drawModule.js'].lineData[57]++;
  canvas.getContext("2d").drawImage(imageToLoad, 0, 0);
  _$jscoverage['drawModule.js'].lineData[58]++;
  console.log("the image has loaded!");
  _$jscoverage['drawModule.js'].lineData[60]++;
  if (visit22_60_1(visit23_60_2(callbackObject != null) && visit24_60_3(callbackFunction != null))) {
    _$jscoverage['drawModule.js'].lineData[61]++;
    callbackFunction.call(callbackObject);
  } else {
    _$jscoverage['drawModule.js'].lineData[63]++;
    if (visit25_63_1(visit26_63_2(callbackObject == null) && visit27_63_3(callbackFunction != null))) {
      _$jscoverage['drawModule.js'].lineData[64]++;
      callbackFunction();
    }
  }
};
  _$jscoverage['drawModule.js'].lineData[68]++;
  imageToLoad.src = imageData;
}
