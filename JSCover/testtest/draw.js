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
if (! _$jscoverage['draw.js']) {
  _$jscoverage['draw.js'] = {};
  _$jscoverage['draw.js'].lineData = [];
  _$jscoverage['draw.js'].lineData[1] = 0;
  _$jscoverage['draw.js'].lineData[11] = 0;
  _$jscoverage['draw.js'].lineData[12] = 0;
  _$jscoverage['draw.js'].lineData[13] = 0;
  _$jscoverage['draw.js'].lineData[14] = 0;
  _$jscoverage['draw.js'].lineData[15] = 0;
  _$jscoverage['draw.js'].lineData[18] = 0;
  _$jscoverage['draw.js'].lineData[19] = 0;
  _$jscoverage['draw.js'].lineData[20] = 0;
  _$jscoverage['draw.js'].lineData[21] = 0;
  _$jscoverage['draw.js'].lineData[22] = 0;
  _$jscoverage['draw.js'].lineData[24] = 0;
  _$jscoverage['draw.js'].lineData[25] = 0;
  _$jscoverage['draw.js'].lineData[26] = 0;
  _$jscoverage['draw.js'].lineData[29] = 0;
  _$jscoverage['draw.js'].lineData[30] = 0;
  _$jscoverage['draw.js'].lineData[34] = 0;
  _$jscoverage['draw.js'].lineData[35] = 0;
  _$jscoverage['draw.js'].lineData[36] = 0;
  _$jscoverage['draw.js'].lineData[38] = 0;
  _$jscoverage['draw.js'].lineData[39] = 0;
  _$jscoverage['draw.js'].lineData[40] = 0;
  _$jscoverage['draw.js'].lineData[42] = 0;
  _$jscoverage['draw.js'].lineData[43] = 0;
  _$jscoverage['draw.js'].lineData[44] = 0;
  _$jscoverage['draw.js'].lineData[48] = 0;
  _$jscoverage['draw.js'].lineData[49] = 0;
  _$jscoverage['draw.js'].lineData[50] = 0;
  _$jscoverage['draw.js'].lineData[54] = 0;
  _$jscoverage['draw.js'].lineData[55] = 0;
  _$jscoverage['draw.js'].lineData[72] = 0;
  _$jscoverage['draw.js'].lineData[73] = 0;
  _$jscoverage['draw.js'].lineData[74] = 0;
  _$jscoverage['draw.js'].lineData[75] = 0;
  _$jscoverage['draw.js'].lineData[76] = 0;
  _$jscoverage['draw.js'].lineData[77] = 0;
  _$jscoverage['draw.js'].lineData[78] = 0;
  _$jscoverage['draw.js'].lineData[81] = 0;
  _$jscoverage['draw.js'].lineData[82] = 0;
  _$jscoverage['draw.js'].lineData[85] = 0;
  _$jscoverage['draw.js'].lineData[86] = 0;
  _$jscoverage['draw.js'].lineData[87] = 0;
  _$jscoverage['draw.js'].lineData[88] = 0;
  _$jscoverage['draw.js'].lineData[92] = 0;
  _$jscoverage['draw.js'].lineData[93] = 0;
  _$jscoverage['draw.js'].lineData[94] = 0;
  _$jscoverage['draw.js'].lineData[97] = 0;
  _$jscoverage['draw.js'].lineData[98] = 0;
  _$jscoverage['draw.js'].lineData[99] = 0;
  _$jscoverage['draw.js'].lineData[100] = 0;
  _$jscoverage['draw.js'].lineData[101] = 0;
  _$jscoverage['draw.js'].lineData[102] = 0;
  _$jscoverage['draw.js'].lineData[103] = 0;
  _$jscoverage['draw.js'].lineData[112] = 0;
  _$jscoverage['draw.js'].lineData[113] = 0;
  _$jscoverage['draw.js'].lineData[114] = 0;
  _$jscoverage['draw.js'].lineData[118] = 0;
  _$jscoverage['draw.js'].lineData[127] = 0;
  _$jscoverage['draw.js'].lineData[128] = 0;
  _$jscoverage['draw.js'].lineData[129] = 0;
  _$jscoverage['draw.js'].lineData[130] = 0;
  _$jscoverage['draw.js'].lineData[131] = 0;
  _$jscoverage['draw.js'].lineData[132] = 0;
  _$jscoverage['draw.js'].lineData[133] = 0;
  _$jscoverage['draw.js'].lineData[135] = 0;
  _$jscoverage['draw.js'].lineData[137] = 0;
  _$jscoverage['draw.js'].lineData[158] = 0;
  _$jscoverage['draw.js'].lineData[159] = 0;
  _$jscoverage['draw.js'].lineData[160] = 0;
  _$jscoverage['draw.js'].lineData[163] = 0;
  _$jscoverage['draw.js'].lineData[164] = 0;
  _$jscoverage['draw.js'].lineData[165] = 0;
  _$jscoverage['draw.js'].lineData[166] = 0;
  _$jscoverage['draw.js'].lineData[168] = 0;
  _$jscoverage['draw.js'].lineData[169] = 0;
  _$jscoverage['draw.js'].lineData[173] = 0;
  _$jscoverage['draw.js'].lineData[174] = 0;
}
if (! _$jscoverage['draw.js'].branchData) {
  _$jscoverage['draw.js'].branchData = [];
  _$jscoverage['draw.js'].branchData[34] = [];
  _$jscoverage['draw.js'].branchData[34][1] = new BranchData();
  _$jscoverage['draw.js'].branchData[38] = [];
  _$jscoverage['draw.js'].branchData[38][1] = new BranchData();
  _$jscoverage['draw.js'].branchData[43] = [];
  _$jscoverage['draw.js'].branchData[43][1] = new BranchData();
  _$jscoverage['draw.js'].branchData[49] = [];
  _$jscoverage['draw.js'].branchData[49][1] = new BranchData();
  _$jscoverage['draw.js'].branchData[158] = [];
  _$jscoverage['draw.js'].branchData[158][1] = new BranchData();
  _$jscoverage['draw.js'].branchData[158][2] = new BranchData();
  _$jscoverage['draw.js'].branchData[158][3] = new BranchData();
  _$jscoverage['draw.js'].branchData[163] = [];
  _$jscoverage['draw.js'].branchData[163][1] = new BranchData();
}
_$jscoverage['draw.js'].branchData[163][1].init(204, 11, 'count == 10');
function visit35_163_1(result) {
  _$jscoverage['draw.js'].branchData[163][1].ranCondition(result);
  return result;
}_$jscoverage['draw.js'].branchData[158][3].init(620, 10, 'prevY > -1');
function visit34_158_3(result) {
  _$jscoverage['draw.js'].branchData[158][3].ranCondition(result);
  return result;
}_$jscoverage['draw.js'].branchData[158][2].init(606, 10, 'prevX > -1');
function visit33_158_2(result) {
  _$jscoverage['draw.js'].branchData[158][2].ranCondition(result);
  return result;
}_$jscoverage['draw.js'].branchData[158][1].init(606, 24, 'prevX > -1 && prevY > -1');
function visit32_158_1(result) {
  _$jscoverage['draw.js'].branchData[158][1].ranCondition(result);
  return result;
}_$jscoverage['draw.js'].branchData[49][1].init(13, 14, 'mouseDown == 1');
function visit31_49_1(result) {
  _$jscoverage['draw.js'].branchData[49][1].ranCondition(result);
  return result;
}_$jscoverage['draw.js'].branchData[43][1].init(513, 14, 'mouseDown == 1');
function visit30_43_1(result) {
  _$jscoverage['draw.js'].branchData[43][1].ranCondition(result);
  return result;
}_$jscoverage['draw.js'].branchData[38][1].init(306, 12, 'event.layerX');
function visit29_38_1(result) {
  _$jscoverage['draw.js'].branchData[38][1].ranCondition(result);
  return result;
}_$jscoverage['draw.js'].branchData[34][1].init(177, 13, 'event.offsetX');
function visit28_34_1(result) {
  _$jscoverage['draw.js'].branchData[34][1].ranCondition(result);
  return result;
}_$jscoverage['draw.js'].lineData[1]++;
var prevX = -1, prevY = -1, canvas, ctx, tempCanvas, tempCtx, clrButton, mouseDown = 0, counter = 0, sizeBigger;
_$jscoverage['draw.js'].lineData[11]++;
function initialize() {
  _$jscoverage['draw.js'].lineData[12]++;
  canvas = document.getElementById('myCanvas');
  _$jscoverage['draw.js'].lineData[13]++;
  clrButton = document.getElementById('clear-button');
  _$jscoverage['draw.js'].lineData[14]++;
  ctx = canvas.getContext("2d");
  _$jscoverage['draw.js'].lineData[15]++;
  sizeBigger = document.getElementById('size-bigger-button');
  _$jscoverage['draw.js'].lineData[18]++;
  var cnvsContainer = canvas.parentNode;
  _$jscoverage['draw.js'].lineData[19]++;
  tempCanvas = document.createElement('canvas');
  _$jscoverage['draw.js'].lineData[20]++;
  tempCanvas.id = "tempCanvas";
  _$jscoverage['draw.js'].lineData[21]++;
  tempCanvas.width = canvas.width;
  _$jscoverage['draw.js'].lineData[22]++;
  tempCanvas.height = canvas.height;
  _$jscoverage['draw.js'].lineData[24]++;
  function canvasUpdate() {
    _$jscoverage['draw.js'].lineData[25]++;
    ctx.drawImage(tempCanvas);
    _$jscoverage['draw.js'].lineData[26]++;
    tempCtx.clearCanvas(tempCtx);
  }
  _$jscoverage['draw.js'].lineData[29]++;
  canvas.onmousemove = function(event) {
  _$jscoverage['draw.js'].lineData[30]++;
  var x, y;
  _$jscoverage['draw.js'].lineData[34]++;
  if (visit28_34_1(event.offsetX)) {
    _$jscoverage['draw.js'].lineData[35]++;
    x = event.offsetX;
    _$jscoverage['draw.js'].lineData[36]++;
    y = event.offsetY;
  } else {
    _$jscoverage['draw.js'].lineData[38]++;
    if (visit29_38_1(event.layerX)) {
      _$jscoverage['draw.js'].lineData[39]++;
      x = event.layerX;
      _$jscoverage['draw.js'].lineData[40]++;
      y = event.layerY;
    }
  }
  _$jscoverage['draw.js'].lineData[42]++;
  document.getElementById('canvas-coord-message').innerHTML = "x: " + x + " y: " + y;
  _$jscoverage['draw.js'].lineData[43]++;
  if (visit30_43_1(mouseDown == 1)) {
    _$jscoverage['draw.js'].lineData[44]++;
    drawLine(x, y);
  }
};
  _$jscoverage['draw.js'].lineData[48]++;
  canvas.onmouseover = function(event) {
  _$jscoverage['draw.js'].lineData[49]++;
  if (visit31_49_1(mouseDown == 1)) {
    _$jscoverage['draw.js'].lineData[50]++;
    drawLine(event);
  }
};
  _$jscoverage['draw.js'].lineData[54]++;
  canvas.onmouseout = function(event) {
  _$jscoverage['draw.js'].lineData[55]++;
  console.log(ctx.lineWidth);
  _$jscoverage['draw.js'].lineData[72]++;
  document.getElementById('canvas-coord-message').innerHTML = "";
  _$jscoverage['draw.js'].lineData[73]++;
  prevX = prevY = -1;
  _$jscoverage['draw.js'].lineData[74]++;
  ctx.stroke();
  _$jscoverage['draw.js'].lineData[75]++;
  ctx.stroke();
  _$jscoverage['draw.js'].lineData[76]++;
  ctx.stroke();
  _$jscoverage['draw.js'].lineData[77]++;
  ctx.stroke();
  _$jscoverage['draw.js'].lineData[78]++;
  mouseDown = 0;
};
  _$jscoverage['draw.js'].lineData[81]++;
  clrButton.onclick = function() {
  _$jscoverage['draw.js'].lineData[82]++;
  clearCanvas(ctx);
};
  _$jscoverage['draw.js'].lineData[85]++;
  sizeBigger.onclick = function() {
  _$jscoverage['draw.js'].lineData[86]++;
  console.log("click: " + ctx.lineWidth);
  _$jscoverage['draw.js'].lineData[87]++;
  ctx.lineWidth = 25;
  _$jscoverage['draw.js'].lineData[88]++;
  return false;
};
  _$jscoverage['draw.js'].lineData[92]++;
  canvas.addEventListener('mousedown', function() {
  _$jscoverage['draw.js'].lineData[93]++;
  ctx.beginPath();
  _$jscoverage['draw.js'].lineData[94]++;
  mouseDown = 1;
}, false);
  _$jscoverage['draw.js'].lineData[97]++;
  canvas.addEventListener('mouseup', function() {
  _$jscoverage['draw.js'].lineData[98]++;
  prevX = prevY = -1;
  _$jscoverage['draw.js'].lineData[99]++;
  ctx.stroke();
  _$jscoverage['draw.js'].lineData[100]++;
  ctx.stroke();
  _$jscoverage['draw.js'].lineData[101]++;
  ctx.stroke();
  _$jscoverage['draw.js'].lineData[102]++;
  ctx.stroke();
  _$jscoverage['draw.js'].lineData[103]++;
  mouseDown = 0;
}, false);
}
_$jscoverage['draw.js'].lineData[112]++;
function clearCanvas(context) {
  _$jscoverage['draw.js'].lineData[113]++;
  prevX = -1;
  _$jscoverage['draw.js'].lineData[114]++;
  prevY = -1;
  _$jscoverage['draw.js'].lineData[118]++;
  context.clearRect(0, 0, canvas.width, canvas.height);
}
_$jscoverage['draw.js'].lineData[127]++;
function fillCircle(x, y, radius, fillColor) {
  _$jscoverage['draw.js'].lineData[128]++;
  ctx.fillStyle = fillColor;
  _$jscoverage['draw.js'].lineData[129]++;
  ctx.beginPath();
  _$jscoverage['draw.js'].lineData[130]++;
  ctx.moveTo(x, y);
  _$jscoverage['draw.js'].lineData[131]++;
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  _$jscoverage['draw.js'].lineData[132]++;
  ctx.fill();
}
_$jscoverage['draw.js'].lineData[133]++;
;
_$jscoverage['draw.js'].lineData[135]++;
var count = 0;
_$jscoverage['draw.js'].lineData[137]++;
function drawLine(x, y) {
  _$jscoverage['draw.js'].lineData[158]++;
  if (visit32_158_1(visit33_158_2(prevX > -1) && visit34_158_3(prevY > -1))) {
    _$jscoverage['draw.js'].lineData[159]++;
    ctx.strokeStyle = '#000000';
    _$jscoverage['draw.js'].lineData[160]++;
    ctx.lineTo(x, y);
    _$jscoverage['draw.js'].lineData[163]++;
    if (visit35_163_1(count == 10)) {
      _$jscoverage['draw.js'].lineData[164]++;
      ctx.stroke();
      _$jscoverage['draw.js'].lineData[165]++;
      count = 0;
    } else {
      _$jscoverage['draw.js'].lineData[166]++;
      count++;
    }
  }
  _$jscoverage['draw.js'].lineData[168]++;
  prevX = x;
  _$jscoverage['draw.js'].lineData[169]++;
  prevY = y;
}
_$jscoverage['draw.js'].lineData[173]++;
function drawRectangle() {
  _$jscoverage['draw.js'].lineData[174]++;
  ;
}
