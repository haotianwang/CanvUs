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
if (! _$jscoverage['updateModule.js']) {
  _$jscoverage['updateModule.js'] = {};
  _$jscoverage['updateModule.js'].lineData = [];
  _$jscoverage['updateModule.js'].lineData[23] = 0;
  _$jscoverage['updateModule.js'].lineData[24] = 0;
  _$jscoverage['updateModule.js'].lineData[27] = 0;
  _$jscoverage['updateModule.js'].lineData[28] = 0;
  _$jscoverage['updateModule.js'].lineData[29] = 0;
  _$jscoverage['updateModule.js'].lineData[30] = 0;
  _$jscoverage['updateModule.js'].lineData[32] = 0;
  _$jscoverage['updateModule.js'].lineData[35] = 0;
  _$jscoverage['updateModule.js'].lineData[36] = 0;
  _$jscoverage['updateModule.js'].lineData[37] = 0;
  _$jscoverage['updateModule.js'].lineData[38] = 0;
  _$jscoverage['updateModule.js'].lineData[39] = 0;
  _$jscoverage['updateModule.js'].lineData[40] = 0;
  _$jscoverage['updateModule.js'].lineData[41] = 0;
  _$jscoverage['updateModule.js'].lineData[42] = 0;
  _$jscoverage['updateModule.js'].lineData[43] = 0;
  _$jscoverage['updateModule.js'].lineData[44] = 0;
  _$jscoverage['updateModule.js'].lineData[45] = 0;
  _$jscoverage['updateModule.js'].lineData[46] = 0;
  _$jscoverage['updateModule.js'].lineData[47] = 0;
  _$jscoverage['updateModule.js'].lineData[48] = 0;
  _$jscoverage['updateModule.js'].lineData[49] = 0;
  _$jscoverage['updateModule.js'].lineData[50] = 0;
  _$jscoverage['updateModule.js'].lineData[52] = 0;
  _$jscoverage['updateModule.js'].lineData[53] = 0;
  _$jscoverage['updateModule.js'].lineData[54] = 0;
  _$jscoverage['updateModule.js'].lineData[55] = 0;
  _$jscoverage['updateModule.js'].lineData[57] = 0;
  _$jscoverage['updateModule.js'].lineData[58] = 0;
  _$jscoverage['updateModule.js'].lineData[59] = 0;
  _$jscoverage['updateModule.js'].lineData[60] = 0;
  _$jscoverage['updateModule.js'].lineData[62] = 0;
  _$jscoverage['updateModule.js'].lineData[65] = 0;
  _$jscoverage['updateModule.js'].lineData[66] = 0;
  _$jscoverage['updateModule.js'].lineData[67] = 0;
  _$jscoverage['updateModule.js'].lineData[68] = 0;
  _$jscoverage['updateModule.js'].lineData[69] = 0;
  _$jscoverage['updateModule.js'].lineData[71] = 0;
  _$jscoverage['updateModule.js'].lineData[73] = 0;
  _$jscoverage['updateModule.js'].lineData[74] = 0;
  _$jscoverage['updateModule.js'].lineData[75] = 0;
  _$jscoverage['updateModule.js'].lineData[77] = 0;
  _$jscoverage['updateModule.js'].lineData[80] = 0;
  _$jscoverage['updateModule.js'].lineData[81] = 0;
  _$jscoverage['updateModule.js'].lineData[84] = 0;
  _$jscoverage['updateModule.js'].lineData[85] = 0;
  _$jscoverage['updateModule.js'].lineData[88] = 0;
  _$jscoverage['updateModule.js'].lineData[89] = 0;
  _$jscoverage['updateModule.js'].lineData[92] = 0;
  _$jscoverage['updateModule.js'].lineData[93] = 0;
  _$jscoverage['updateModule.js'].lineData[96] = 0;
  _$jscoverage['updateModule.js'].lineData[97] = 0;
  _$jscoverage['updateModule.js'].lineData[98] = 0;
  _$jscoverage['updateModule.js'].lineData[99] = 0;
  _$jscoverage['updateModule.js'].lineData[102] = 0;
  _$jscoverage['updateModule.js'].lineData[103] = 0;
  _$jscoverage['updateModule.js'].lineData[106] = 0;
  _$jscoverage['updateModule.js'].lineData[107] = 0;
  _$jscoverage['updateModule.js'].lineData[110] = 0;
  _$jscoverage['updateModule.js'].lineData[111] = 0;
  _$jscoverage['updateModule.js'].lineData[112] = 0;
  _$jscoverage['updateModule.js'].lineData[115] = 0;
  _$jscoverage['updateModule.js'].lineData[116] = 0;
  _$jscoverage['updateModule.js'].lineData[117] = 0;
  _$jscoverage['updateModule.js'].lineData[118] = 0;
  _$jscoverage['updateModule.js'].lineData[122] = 0;
  _$jscoverage['updateModule.js'].lineData[123] = 0;
  _$jscoverage['updateModule.js'].lineData[124] = 0;
  _$jscoverage['updateModule.js'].lineData[125] = 0;
  _$jscoverage['updateModule.js'].lineData[127] = 0;
  _$jscoverage['updateModule.js'].lineData[135] = 0;
  _$jscoverage['updateModule.js'].lineData[136] = 0;
  _$jscoverage['updateModule.js'].lineData[138] = 0;
  _$jscoverage['updateModule.js'].lineData[139] = 0;
  _$jscoverage['updateModule.js'].lineData[140] = 0;
  _$jscoverage['updateModule.js'].lineData[141] = 0;
  _$jscoverage['updateModule.js'].lineData[143] = 0;
  _$jscoverage['updateModule.js'].lineData[146] = 0;
  _$jscoverage['updateModule.js'].lineData[150] = 0;
  _$jscoverage['updateModule.js'].lineData[151] = 0;
  _$jscoverage['updateModule.js'].lineData[152] = 0;
  _$jscoverage['updateModule.js'].lineData[153] = 0;
  _$jscoverage['updateModule.js'].lineData[154] = 0;
  _$jscoverage['updateModule.js'].lineData[155] = 0;
  _$jscoverage['updateModule.js'].lineData[156] = 0;
  _$jscoverage['updateModule.js'].lineData[159] = 0;
  _$jscoverage['updateModule.js'].lineData[160] = 0;
  _$jscoverage['updateModule.js'].lineData[162] = 0;
  _$jscoverage['updateModule.js'].lineData[163] = 0;
  _$jscoverage['updateModule.js'].lineData[164] = 0;
  _$jscoverage['updateModule.js'].lineData[165] = 0;
  _$jscoverage['updateModule.js'].lineData[166] = 0;
  _$jscoverage['updateModule.js'].lineData[170] = 0;
  _$jscoverage['updateModule.js'].lineData[171] = 0;
  _$jscoverage['updateModule.js'].lineData[172] = 0;
  _$jscoverage['updateModule.js'].lineData[173] = 0;
  _$jscoverage['updateModule.js'].lineData[174] = 0;
  _$jscoverage['updateModule.js'].lineData[176] = 0;
  _$jscoverage['updateModule.js'].lineData[177] = 0;
  _$jscoverage['updateModule.js'].lineData[178] = 0;
  _$jscoverage['updateModule.js'].lineData[179] = 0;
  _$jscoverage['updateModule.js'].lineData[180] = 0;
  _$jscoverage['updateModule.js'].lineData[182] = 0;
  _$jscoverage['updateModule.js'].lineData[183] = 0;
  _$jscoverage['updateModule.js'].lineData[186] = 0;
  _$jscoverage['updateModule.js'].lineData[190] = 0;
  _$jscoverage['updateModule.js'].lineData[191] = 0;
  _$jscoverage['updateModule.js'].lineData[195] = 0;
  _$jscoverage['updateModule.js'].lineData[198] = 0;
  _$jscoverage['updateModule.js'].lineData[199] = 0;
  _$jscoverage['updateModule.js'].lineData[202] = 0;
  _$jscoverage['updateModule.js'].lineData[205] = 0;
  _$jscoverage['updateModule.js'].lineData[206] = 0;
  _$jscoverage['updateModule.js'].lineData[208] = 0;
  _$jscoverage['updateModule.js'].lineData[209] = 0;
  _$jscoverage['updateModule.js'].lineData[211] = 0;
  _$jscoverage['updateModule.js'].lineData[212] = 0;
  _$jscoverage['updateModule.js'].lineData[214] = 0;
  _$jscoverage['updateModule.js'].lineData[215] = 0;
  _$jscoverage['updateModule.js'].lineData[217] = 0;
  _$jscoverage['updateModule.js'].lineData[218] = 0;
  _$jscoverage['updateModule.js'].lineData[220] = 0;
  _$jscoverage['updateModule.js'].lineData[224] = 0;
  _$jscoverage['updateModule.js'].lineData[225] = 0;
  _$jscoverage['updateModule.js'].lineData[226] = 0;
  _$jscoverage['updateModule.js'].lineData[229] = 0;
  _$jscoverage['updateModule.js'].lineData[230] = 0;
  _$jscoverage['updateModule.js'].lineData[231] = 0;
  _$jscoverage['updateModule.js'].lineData[232] = 0;
  _$jscoverage['updateModule.js'].lineData[234] = 0;
  _$jscoverage['updateModule.js'].lineData[235] = 0;
  _$jscoverage['updateModule.js'].lineData[236] = 0;
  _$jscoverage['updateModule.js'].lineData[238] = 0;
  _$jscoverage['updateModule.js'].lineData[239] = 0;
  _$jscoverage['updateModule.js'].lineData[242] = 0;
  _$jscoverage['updateModule.js'].lineData[246] = 0;
  _$jscoverage['updateModule.js'].lineData[247] = 0;
  _$jscoverage['updateModule.js'].lineData[250] = 0;
  _$jscoverage['updateModule.js'].lineData[254] = 0;
  _$jscoverage['updateModule.js'].lineData[255] = 0;
  _$jscoverage['updateModule.js'].lineData[257] = 0;
  _$jscoverage['updateModule.js'].lineData[258] = 0;
  _$jscoverage['updateModule.js'].lineData[259] = 0;
  _$jscoverage['updateModule.js'].lineData[262] = 0;
  _$jscoverage['updateModule.js'].lineData[263] = 0;
  _$jscoverage['updateModule.js'].lineData[264] = 0;
  _$jscoverage['updateModule.js'].lineData[265] = 0;
  _$jscoverage['updateModule.js'].lineData[266] = 0;
  _$jscoverage['updateModule.js'].lineData[268] = 0;
  _$jscoverage['updateModule.js'].lineData[270] = 0;
  _$jscoverage['updateModule.js'].lineData[273] = 0;
  _$jscoverage['updateModule.js'].lineData[274] = 0;
  _$jscoverage['updateModule.js'].lineData[275] = 0;
  _$jscoverage['updateModule.js'].lineData[281] = 0;
  _$jscoverage['updateModule.js'].lineData[282] = 0;
  _$jscoverage['updateModule.js'].lineData[284] = 0;
  _$jscoverage['updateModule.js'].lineData[288] = 0;
  _$jscoverage['updateModule.js'].lineData[292] = 0;
  _$jscoverage['updateModule.js'].lineData[296] = 0;
  _$jscoverage['updateModule.js'].lineData[300] = 0;
  _$jscoverage['updateModule.js'].lineData[303] = 0;
}
if (! _$jscoverage['updateModule.js'].branchData) {
  _$jscoverage['updateModule.js'].branchData = [];
  _$jscoverage['updateModule.js'].branchData[24] = [];
  _$jscoverage['updateModule.js'].branchData[24][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[24][2] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[59] = [];
  _$jscoverage['updateModule.js'].branchData[59][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[98] = [];
  _$jscoverage['updateModule.js'].branchData[98][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[116] = [];
  _$jscoverage['updateModule.js'].branchData[116][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[123] = [];
  _$jscoverage['updateModule.js'].branchData[123][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[135] = [];
  _$jscoverage['updateModule.js'].branchData[135][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[164] = [];
  _$jscoverage['updateModule.js'].branchData[164][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[177] = [];
  _$jscoverage['updateModule.js'].branchData[177][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[178] = [];
  _$jscoverage['updateModule.js'].branchData[178][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[179] = [];
  _$jscoverage['updateModule.js'].branchData[179][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[182] = [];
  _$jscoverage['updateModule.js'].branchData[182][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[190] = [];
  _$jscoverage['updateModule.js'].branchData[190][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[198] = [];
  _$jscoverage['updateModule.js'].branchData[198][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[234] = [];
  _$jscoverage['updateModule.js'].branchData[234][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[238] = [];
  _$jscoverage['updateModule.js'].branchData[238][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[246] = [];
  _$jscoverage['updateModule.js'].branchData[246][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[257] = [];
  _$jscoverage['updateModule.js'].branchData[257][1] = new BranchData();
  _$jscoverage['updateModule.js'].branchData[263] = [];
  _$jscoverage['updateModule.js'].branchData[263][1] = new BranchData();
}
_$jscoverage['updateModule.js'].branchData[263][1].init(300, 27, 'i < this.initActions.length');
function visit19_263_1(result) {
  _$jscoverage['updateModule.js'].branchData[263][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[257][1].init(90, 24, 'this.initActions == null');
function visit18_257_1(result) {
  _$jscoverage['updateModule.js'].branchData[257][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[246][1].init(932, 19, 'myJson.bitmap != ""');
function visit17_246_1(result) {
  _$jscoverage['updateModule.js'].branchData[246][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[238][1].init(251, 24, 'this.initActions == null');
function visit16_238_1(result) {
  _$jscoverage['updateModule.js'].branchData[238][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[234][1].init(289, 20, 'myJson.actions != ""');
function visit15_234_1(result) {
  _$jscoverage['updateModule.js'].branchData[234][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[198][1].init(921, 24, 'i < listOfActions.length');
function visit14_198_1(result) {
  _$jscoverage['updateModule.js'].branchData[198][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[190][1].init(455, 24, 'i < listOfActions.length');
function visit13_190_1(result) {
  _$jscoverage['updateModule.js'].branchData[190][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[182][1].init(138, 27, 'i == listOfActions.length - 1');
function visit12_182_1(result) {
  _$jscoverage['updateModule.js'].branchData[182][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[179][1].init(21, 6, 'i == 0');
function visit11_179_1(result) {
  _$jscoverage['updateModule.js'].branchData[179][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[178][1].init(25, 24, 'i < listOfActions.length');
function visit10_178_1(result) {
  _$jscoverage['updateModule.js'].branchData[178][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[177][1].init(227, 24, 'listOfActions.length > 1');
function visit9_177_1(result) {
  _$jscoverage['updateModule.js'].branchData[177][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[164][1].init(267, 38, 'this.actionsCount >= this.actionsLimit');
function visit8_164_1(result) {
  _$jscoverage['updateModule.js'].branchData[164][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[135][1].init(433, 14, 'fillOn != null');
function visit7_135_1(result) {
  _$jscoverage['updateModule.js'].branchData[135][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[123][1].init(12, 20, 'this.dontSendActions');
function visit6_123_1(result) {
  _$jscoverage['updateModule.js'].branchData[123][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[116][1].init(13, 18, 'this.timer != null');
function visit5_116_1(result) {
  _$jscoverage['updateModule.js'].branchData[116][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[98][1].init(42, 14, 'canvas != null');
function visit4_98_1(result) {
  _$jscoverage['updateModule.js'].branchData[98][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[59][1].init(201, 16, 'canvasID != null');
function visit3_59_1(result) {
  _$jscoverage['updateModule.js'].branchData[59][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[24][2].init(30, 84, 'new RegExp(\'[?|&]\' + name + \'=\' + \'([^&;]+?)(&|#|;|$)\').exec(location.search) || [, ""]');
function visit2_24_2(result) {
  _$jscoverage['updateModule.js'].branchData[24][2].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].branchData[24][1].init(10, 137, 'decodeURIComponent((new RegExp(\'[?|&]\' + name + \'=\' + \'([^&;]+?)(&|#|;|$)\').exec(location.search) || [, ""])[1].replace(/\\+/g, \'%20\')) || null');
function visit1_24_1(result) {
  _$jscoverage['updateModule.js'].branchData[24][1].ranCondition(result);
  return result;
}_$jscoverage['updateModule.js'].lineData[23]++;
function getURLParameter(name) {
  _$jscoverage['updateModule.js'].lineData[24]++;
  return visit1_24_1(decodeURIComponent((visit2_24_2(new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""]))[1].replace(/\+/g, '%20')) || null);
}
_$jscoverage['updateModule.js'].lineData[27]++;
function instantiateUpdateModule(socketClass) {
  _$jscoverage['updateModule.js'].lineData[28]++;
  var module = new UpdateModule();
  _$jscoverage['updateModule.js'].lineData[29]++;
  module.setSocketClass(socketClass);
  _$jscoverage['updateModule.js'].lineData[30]++;
  module.resetDefaults();
  _$jscoverage['updateModule.js'].lineData[32]++;
  return module;
}
_$jscoverage['updateModule.js'].lineData[35]++;
function UpdateModule() {
  _$jscoverage['updateModule.js'].lineData[36]++;
  this.socketClass = null;
  _$jscoverage['updateModule.js'].lineData[37]++;
  this.dispatcher = null;
  _$jscoverage['updateModule.js'].lineData[38]++;
  this.DrawAPI = null;
  _$jscoverage['updateModule.js'].lineData[39]++;
  this.context = null;
  _$jscoverage['updateModule.js'].lineData[40]++;
  this.canvas = null;
  _$jscoverage['updateModule.js'].lineData[41]++;
  this.userCookie = null;
  _$jscoverage['updateModule.js'].lineData[42]++;
  this.canvasID = null;
  _$jscoverage['updateModule.js'].lineData[43]++;
  this.channel = null;
  _$jscoverage['updateModule.js'].lineData[44]++;
  this.sendActionsTimeInterval = 1000;
  _$jscoverage['updateModule.js'].lineData[45]++;
  this.lastActionTime = null;
  _$jscoverage['updateModule.js'].lineData[46]++;
  this.actionsLimit = 300;
  _$jscoverage['updateModule.js'].lineData[47]++;
  this.actionsCount = 0;
  _$jscoverage['updateModule.js'].lineData[48]++;
  this.initActions = null;
  _$jscoverage['updateModule.js'].lineData[49]++;
  this.dontSendActions = false;
  _$jscoverage['updateModule.js'].lineData[50]++;
  this.timer = null;
  _$jscoverage['updateModule.js'].lineData[52]++;
  this.resetDefaults = function() {
  _$jscoverage['updateModule.js'].lineData[53]++;
  this.setDrawAPI(getDrawAPI());
  _$jscoverage['updateModule.js'].lineData[54]++;
  this.setContext(dispCtx);
  _$jscoverage['updateModule.js'].lineData[55]++;
  this.setCanvas(dispCanvas);
  _$jscoverage['updateModule.js'].lineData[57]++;
  this.setCanvasID(-1);
  _$jscoverage['updateModule.js'].lineData[58]++;
  canvasID = getURLParameter("canvasId");
  _$jscoverage['updateModule.js'].lineData[59]++;
  if (visit3_59_1(canvasID != null)) {
    _$jscoverage['updateModule.js'].lineData[60]++;
    this.setCanvasID(canvasID);
  }
  _$jscoverage['updateModule.js'].lineData[62]++;
  this.setUserCookie(-1);
};
  _$jscoverage['updateModule.js'].lineData[65]++;
  this.initialize = function() {
  _$jscoverage['updateModule.js'].lineData[66]++;
  this.url = document.URL.split('/')[2] + "/websocket";
  _$jscoverage['updateModule.js'].lineData[67]++;
  console.log("socket at " + this.url);
  _$jscoverage['updateModule.js'].lineData[68]++;
  this.dispatcher = new this.socketClass(this.url);
  _$jscoverage['updateModule.js'].lineData[69]++;
  this.channel = this.dispatcher.subscribe(this.canvasID + '');
  _$jscoverage['updateModule.js'].lineData[71]++;
  var module = this;
  _$jscoverage['updateModule.js'].lineData[73]++;
  this.dispatcher.bind('socket.get_init_img', function(data) {
  module.getInitImgHandler(data);
});
  _$jscoverage['updateModule.js'].lineData[74]++;
  this.channel.bind('socket.get_action', function(data) {
  module.handleGetAction(data);
});
  _$jscoverage['updateModule.js'].lineData[75]++;
  this.channel.bind('socket.sent_bitmap', function(data) {
  module.handleSentBitmap();
});
  _$jscoverage['updateModule.js'].lineData[77]++;
  this.startTimer();
};
  _$jscoverage['updateModule.js'].lineData[80]++;
  this.setActionsLimit = function(limit) {
  _$jscoverage['updateModule.js'].lineData[81]++;
  this.actionsLimit = limit;
};
  _$jscoverage['updateModule.js'].lineData[84]++;
  this.setUserCookie = function(userCookie) {
  _$jscoverage['updateModule.js'].lineData[85]++;
  this.userCookie = userCookie;
};
  _$jscoverage['updateModule.js'].lineData[88]++;
  this.setCanvasID = function(canvasID) {
  _$jscoverage['updateModule.js'].lineData[89]++;
  this.canvasID = canvasID;
};
  _$jscoverage['updateModule.js'].lineData[92]++;
  this.setContext = function(context) {
  _$jscoverage['updateModule.js'].lineData[93]++;
  this.context = context;
};
  _$jscoverage['updateModule.js'].lineData[96]++;
  this.setCanvas = function(canvas) {
  _$jscoverage['updateModule.js'].lineData[97]++;
  this.canvas = canvas;
  _$jscoverage['updateModule.js'].lineData[98]++;
  if (visit4_98_1(canvas != null)) {
    _$jscoverage['updateModule.js'].lineData[99]++;
    this.context = canvas.getContext("2d");
  }
};
  _$jscoverage['updateModule.js'].lineData[102]++;
  this.setSocketClass = function(socketClass) {
  _$jscoverage['updateModule.js'].lineData[103]++;
  this.socketClass = socketClass;
};
  _$jscoverage['updateModule.js'].lineData[106]++;
  this.setDrawAPI = function(API) {
  _$jscoverage['updateModule.js'].lineData[107]++;
  this.DrawAPI = API;
};
  _$jscoverage['updateModule.js'].lineData[110]++;
  this.startTimer = function() {
  _$jscoverage['updateModule.js'].lineData[111]++;
  var module = this;
  _$jscoverage['updateModule.js'].lineData[112]++;
  this.timer = setInterval(module.sendActions, this.sendActionsTimeInterval);
};
  _$jscoverage['updateModule.js'].lineData[115]++;
  this.stopTimer = function() {
  _$jscoverage['updateModule.js'].lineData[116]++;
  if (visit5_116_1(this.timer != null)) {
    _$jscoverage['updateModule.js'].lineData[117]++;
    clearInterval(this.timer);
    _$jscoverage['updateModule.js'].lineData[118]++;
    this.timer = null;
  }
};
  _$jscoverage['updateModule.js'].lineData[122]++;
  this.sendAction = function(drawActionType, startx, starty, endx, endy, color, strokeWidth, fillOn) {
  _$jscoverage['updateModule.js'].lineData[123]++;
  if (visit6_123_1(this.dontSendActions)) {
    _$jscoverage['updateModule.js'].lineData[124]++;
    console.log("didn't send action");
    _$jscoverage['updateModule.js'].lineData[125]++;
    return;
  }
  _$jscoverage['updateModule.js'].lineData[127]++;
  var myActionJson = {
  "action": drawActionType, 
  "startx": startx, 
  "starty": starty, 
  "endx": endx, 
  "endy": endy, 
  "color": color, 
  "strokeWidth": strokeWidth};
  _$jscoverage['updateModule.js'].lineData[135]++;
  if (visit7_135_1(fillOn != null)) {
    _$jscoverage['updateModule.js'].lineData[136]++;
    myActionJson["fillOn"] = fillOn;
  }
  _$jscoverage['updateModule.js'].lineData[138]++;
  var myMsgJson = {
  "message": JSON.stringify(myActionJson)};
  _$jscoverage['updateModule.js'].lineData[139]++;
  myMsgJson["canvasID"] = this.canvasID;
  _$jscoverage['updateModule.js'].lineData[140]++;
  myMsgJson["userCookie"] = this.userCookie;
  _$jscoverage['updateModule.js'].lineData[141]++;
  console.log("sending action..." + JSON.stringify(myMsgJson));
  _$jscoverage['updateModule.js'].lineData[143]++;
  this.dispatcher.trigger('socket.send_action', JSON.stringify(myMsgJson));
};
  _$jscoverage['updateModule.js'].lineData[146]++;
  this.sendActions = function() {
};
  _$jscoverage['updateModule.js'].lineData[150]++;
  this.sendBitmap = function() {
  _$jscoverage['updateModule.js'].lineData[151]++;
  bitmap = this.canvas.toDataURL("image/png").toString();
  _$jscoverage['updateModule.js'].lineData[152]++;
  myMsgJson = {
  "bitmap": bitmap};
  _$jscoverage['updateModule.js'].lineData[153]++;
  myMsgJson["canvasID"] = this.canvasID;
  _$jscoverage['updateModule.js'].lineData[154]++;
  myMsgJson["timestamp"] = this.lastActionTime;
  _$jscoverage['updateModule.js'].lineData[155]++;
  this.dispatcher.trigger('socket.send_bitmap', JSON.stringify(myMsgJson));
  _$jscoverage['updateModule.js'].lineData[156]++;
  console.log("just sent updated bitmap! it was " + JSON.stringify(myMsgJson));
};
  _$jscoverage['updateModule.js'].lineData[159]++;
  this.handleGetAction = function(data) {
  _$jscoverage['updateModule.js'].lineData[160]++;
  myJson = JSON.parse(data);
  _$jscoverage['updateModule.js'].lineData[162]++;
  this.invokeDrawingModule(this.canvas, myJson.action, myJson.startx, myJson.starty, myJson.endx, myJson.endy, myJson.color, myJson.strokeWidth, myJson.fillOn);
  _$jscoverage['updateModule.js'].lineData[163]++;
  this.actionsCount = this.actionsCount + 1;
  _$jscoverage['updateModule.js'].lineData[164]++;
  if (visit8_164_1(this.actionsCount >= this.actionsLimit)) {
    _$jscoverage['updateModule.js'].lineData[165]++;
    this.actionsCount = 0;
    _$jscoverage['updateModule.js'].lineData[166]++;
    this.sendBitmap();
  }
};
  _$jscoverage['updateModule.js'].lineData[170]++;
  this.handleGetActions = function(data) {
  _$jscoverage['updateModule.js'].lineData[171]++;
  console.log("got actions! parsing...");
  _$jscoverage['updateModule.js'].lineData[172]++;
  myJson = JSON.parse(data);
  _$jscoverage['updateModule.js'].lineData[173]++;
  actionsString = myJson.message;
  _$jscoverage['updateModule.js'].lineData[174]++;
  timestamp = myJson.timestamp;
  _$jscoverage['updateModule.js'].lineData[176]++;
  listOfActions = actionsString.split("},{");
  _$jscoverage['updateModule.js'].lineData[177]++;
  if (visit9_177_1(listOfActions.length > 1)) {
    _$jscoverage['updateModule.js'].lineData[178]++;
    for (i = 0; visit10_178_1(i < listOfActions.length); i++) {
      _$jscoverage['updateModule.js'].lineData[179]++;
      if (visit11_179_1(i == 0)) {
        _$jscoverage['updateModule.js'].lineData[180]++;
        listOfActions[i] = listOfActions[i] + "}";
      } else {
        _$jscoverage['updateModule.js'].lineData[182]++;
        if (visit12_182_1(i == listOfActions.length - 1)) {
          _$jscoverage['updateModule.js'].lineData[183]++;
          listOfActions[i] = "{" + listOfActions[i];
        } else {
          _$jscoverage['updateModule.js'].lineData[186]++;
          listOfActions[i] = "{" + listOfActions[i] + "}";
        }
      }
    }
    _$jscoverage['updateModule.js'].lineData[190]++;
    for (i = 0; visit13_190_1(i < listOfActions.length); i++) {
      _$jscoverage['updateModule.js'].lineData[191]++;
      console.log("got action: " + listOfActions[i]);
    }
  } else {
    _$jscoverage['updateModule.js'].lineData[195]++;
    listOfActions = [actionsString];
  }
  _$jscoverage['updateModule.js'].lineData[198]++;
  for (i = 0; visit14_198_1(i < listOfActions.length); i++) {
    _$jscoverage['updateModule.js'].lineData[199]++;
    this.handleGetAction(listOfActions[i]);
  }
  _$jscoverage['updateModule.js'].lineData[202]++;
  this.lastActionTime = timestamp;
};
  _$jscoverage['updateModule.js'].lineData[205]++;
  this.invokeDrawingModule = function(canvas, action, startx, starty, endx, endy, color, strokeWidth, fillOn) {
  _$jscoverage['updateModule.js'].lineData[206]++;
  switch (action) {
    case "line":
      _$jscoverage['updateModule.js'].lineData[208]++;
      this.DrawAPI.drawLine(canvas, startx, starty, endx, endy, color, strokeWidth);
      _$jscoverage['updateModule.js'].lineData[209]++;
      break;
    case "clear":
      _$jscoverage['updateModule.js'].lineData[211]++;
      this.DrawAPI.clearCanvas(canvas);
      _$jscoverage['updateModule.js'].lineData[212]++;
      break;
    case "rectangle":
      _$jscoverage['updateModule.js'].lineData[214]++;
      this.DrawAPI.drawRectangle(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn);
      _$jscoverage['updateModule.js'].lineData[215]++;
      break;
    case "circle":
      _$jscoverage['updateModule.js'].lineData[217]++;
      this.DrawAPI.drawCircle(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn);
      _$jscoverage['updateModule.js'].lineData[218]++;
      break;
    default:
      _$jscoverage['updateModule.js'].lineData[220]++;
      console.log("invokeDrawingModule failed due to unknown action: " + action);
  }
};
  _$jscoverage['updateModule.js'].lineData[224]++;
  this.getInitImg = function(canvasID) {
  _$jscoverage['updateModule.js'].lineData[225]++;
  console.log("getting initial image...");
  _$jscoverage['updateModule.js'].lineData[226]++;
  this.dispatcher.trigger('socket.send_init_img', "" + canvasID);
};
  _$jscoverage['updateModule.js'].lineData[229]++;
  this.getInitImgHandler = function(data) {
  _$jscoverage['updateModule.js'].lineData[230]++;
  console.log("got image, raw data is " + data);
  _$jscoverage['updateModule.js'].lineData[231]++;
  var myJson = JSON.parse(data);
  _$jscoverage['updateModule.js'].lineData[232]++;
  console.log("got image. it's: " + JSON.stringify(myJson));
  _$jscoverage['updateModule.js'].lineData[234]++;
  if (visit15_234_1(myJson.actions != "")) {
    _$jscoverage['updateModule.js'].lineData[235]++;
    var actions = myJson.actions.split(", ");
    _$jscoverage['updateModule.js'].lineData[236]++;
    console.log("parsed actions is " + actions);
    _$jscoverage['updateModule.js'].lineData[238]++;
    if (visit16_238_1(this.initActions == null)) {
      _$jscoverage['updateModule.js'].lineData[239]++;
      this.initActions = actions;
    } else {
      _$jscoverage['updateModule.js'].lineData[242]++;
      console.log("ERROR: updateModule.initActions is not null when getInitImgHandler is invoked");
    }
  }
  _$jscoverage['updateModule.js'].lineData[246]++;
  if (visit17_246_1(myJson.bitmap != "")) {
    _$jscoverage['updateModule.js'].lineData[247]++;
    this.DrawAPI.drawBitmap(this.canvas, myJson.bitmap, this, this.drawInitActions);
  } else {
    _$jscoverage['updateModule.js'].lineData[250]++;
    this.drawInitActions();
  }
};
  _$jscoverage['updateModule.js'].lineData[254]++;
  this.drawInitActions = function() {
  _$jscoverage['updateModule.js'].lineData[255]++;
  console.log("drawInitActions: initActions is " + this.initActions);
  _$jscoverage['updateModule.js'].lineData[257]++;
  if (visit18_257_1(this.initActions == null)) {
    _$jscoverage['updateModule.js'].lineData[258]++;
    console.log("drawInitActions called, but initActions is null!");
    _$jscoverage['updateModule.js'].lineData[259]++;
    return;
  }
  _$jscoverage['updateModule.js'].lineData[262]++;
  console.log("drawing initial actions..");
  _$jscoverage['updateModule.js'].lineData[263]++;
  for (var i = 0; visit19_263_1(i < this.initActions.length); i++) {
    _$jscoverage['updateModule.js'].lineData[264]++;
    var thisAction = JSON.parse(this.initActions[i]);
    _$jscoverage['updateModule.js'].lineData[265]++;
    console.log("drawing " + JSON.stringify(thisAction));
    _$jscoverage['updateModule.js'].lineData[266]++;
    this.invokeDrawingModule(this.canvas, thisAction.action, thisAction.startx, thisAction.starty, thisAction.endx, thisAction.endy, thisAction.color, thisAction.strokeWidth, thisAction.fillOn);
  }
  _$jscoverage['updateModule.js'].lineData[268]++;
  console.log("done drawing initial actions!");
  _$jscoverage['updateModule.js'].lineData[270]++;
  this.initActions = null;
};
  _$jscoverage['updateModule.js'].lineData[273]++;
  this.handleSentBitmap = function() {
  _$jscoverage['updateModule.js'].lineData[274]++;
  this.actionsCount = 0;
  _$jscoverage['updateModule.js'].lineData[275]++;
  console.log("server says bitmap has been sent already");
};
}
_$jscoverage['updateModule.js'].lineData[281]++;
function getDrawAPI() {
  _$jscoverage['updateModule.js'].lineData[282]++;
  API = {
  drawLine: function(canvas, startx, starty, endx, endy, color, strokeWidth) {
  _$jscoverage['updateModule.js'].lineData[284]++;
  drawLine(canvas, startx, starty, endx, endy, color, strokeWidth);
}, 
  clearCanvas: function(canvas) {
  _$jscoverage['updateModule.js'].lineData[288]++;
  clearCanvas(canvas);
}, 
  drawRectangle: function(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn) {
  _$jscoverage['updateModule.js'].lineData[292]++;
  drawRectangle(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn);
}, 
  drawCircle: function(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn) {
  _$jscoverage['updateModule.js'].lineData[296]++;
  drawCircle(canvas, startx, starty, endx, endy, color, strokeWidth, fillOn);
}, 
  drawBitmap: function(canvas, bitmap, callbackObject, callbackFunction) {
  _$jscoverage['updateModule.js'].lineData[300]++;
  drawBitmap(canvas, bitmap, callbackObject, callbackFunction);
}};
  _$jscoverage['updateModule.js'].lineData[303]++;
  return API;
}
