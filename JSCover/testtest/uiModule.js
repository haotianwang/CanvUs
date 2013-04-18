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
if (! _$jscoverage['uiModule.js']) {
  _$jscoverage['uiModule.js'] = {};
  _$jscoverage['uiModule.js'].lineData = [];
  _$jscoverage['uiModule.js'].lineData[1] = 0;
  _$jscoverage['uiModule.js'].lineData[31] = 0;
  _$jscoverage['uiModule.js'].lineData[36] = 0;
  _$jscoverage['uiModule.js'].lineData[38] = 0;
  _$jscoverage['uiModule.js'].lineData[43] = 0;
  _$jscoverage['uiModule.js'].lineData[44] = 0;
  _$jscoverage['uiModule.js'].lineData[47] = 0;
  _$jscoverage['uiModule.js'].lineData[48] = 0;
  _$jscoverage['uiModule.js'].lineData[49] = 0;
  _$jscoverage['uiModule.js'].lineData[50] = 0;
  _$jscoverage['uiModule.js'].lineData[51] = 0;
  _$jscoverage['uiModule.js'].lineData[56] = 0;
  _$jscoverage['uiModule.js'].lineData[57] = 0;
  _$jscoverage['uiModule.js'].lineData[58] = 0;
  _$jscoverage['uiModule.js'].lineData[59] = 0;
  _$jscoverage['uiModule.js'].lineData[60] = 0;
  _$jscoverage['uiModule.js'].lineData[62] = 0;
  _$jscoverage['uiModule.js'].lineData[63] = 0;
  _$jscoverage['uiModule.js'].lineData[64] = 0;
  _$jscoverage['uiModule.js'].lineData[66] = 0;
  _$jscoverage['uiModule.js'].lineData[67] = 0;
  _$jscoverage['uiModule.js'].lineData[68] = 0;
  _$jscoverage['uiModule.js'].lineData[73] = 0;
  _$jscoverage['uiModule.js'].lineData[74] = 0;
  _$jscoverage['uiModule.js'].lineData[75] = 0;
  _$jscoverage['uiModule.js'].lineData[76] = 0;
  _$jscoverage['uiModule.js'].lineData[77] = 0;
  _$jscoverage['uiModule.js'].lineData[81] = 0;
  _$jscoverage['uiModule.js'].lineData[82] = 0;
  _$jscoverage['uiModule.js'].lineData[83] = 0;
  _$jscoverage['uiModule.js'].lineData[84] = 0;
  _$jscoverage['uiModule.js'].lineData[85] = 0;
  _$jscoverage['uiModule.js'].lineData[86] = 0;
  _$jscoverage['uiModule.js'].lineData[89] = 0;
  _$jscoverage['uiModule.js'].lineData[90] = 0;
  _$jscoverage['uiModule.js'].lineData[95] = 0;
  _$jscoverage['uiModule.js'].lineData[96] = 0;
  _$jscoverage['uiModule.js'].lineData[97] = 0;
  _$jscoverage['uiModule.js'].lineData[99] = 0;
  _$jscoverage['uiModule.js'].lineData[100] = 0;
  _$jscoverage['uiModule.js'].lineData[101] = 0;
  _$jscoverage['uiModule.js'].lineData[103] = 0;
  _$jscoverage['uiModule.js'].lineData[104] = 0;
  _$jscoverage['uiModule.js'].lineData[105] = 0;
  _$jscoverage['uiModule.js'].lineData[106] = 0;
  _$jscoverage['uiModule.js'].lineData[110] = 0;
  _$jscoverage['uiModule.js'].lineData[111] = 0;
  _$jscoverage['uiModule.js'].lineData[112] = 0;
  _$jscoverage['uiModule.js'].lineData[116] = 0;
  _$jscoverage['uiModule.js'].lineData[117] = 0;
  _$jscoverage['uiModule.js'].lineData[118] = 0;
  _$jscoverage['uiModule.js'].lineData[121] = 0;
  _$jscoverage['uiModule.js'].lineData[122] = 0;
  _$jscoverage['uiModule.js'].lineData[126] = 0;
  _$jscoverage['uiModule.js'].lineData[127] = 0;
  _$jscoverage['uiModule.js'].lineData[128] = 0;
  _$jscoverage['uiModule.js'].lineData[129] = 0;
  _$jscoverage['uiModule.js'].lineData[130] = 0;
  _$jscoverage['uiModule.js'].lineData[131] = 0;
  _$jscoverage['uiModule.js'].lineData[133] = 0;
  _$jscoverage['uiModule.js'].lineData[137] = 0;
  _$jscoverage['uiModule.js'].lineData[138] = 0;
  _$jscoverage['uiModule.js'].lineData[143] = 0;
  _$jscoverage['uiModule.js'].lineData[144] = 0;
  _$jscoverage['uiModule.js'].lineData[146] = 0;
  _$jscoverage['uiModule.js'].lineData[147] = 0;
  _$jscoverage['uiModule.js'].lineData[148] = 0;
  _$jscoverage['uiModule.js'].lineData[150] = 0;
  _$jscoverage['uiModule.js'].lineData[151] = 0;
  _$jscoverage['uiModule.js'].lineData[152] = 0;
  _$jscoverage['uiModule.js'].lineData[156] = 0;
  _$jscoverage['uiModule.js'].lineData[157] = 0;
  _$jscoverage['uiModule.js'].lineData[158] = 0;
  _$jscoverage['uiModule.js'].lineData[161] = 0;
  _$jscoverage['uiModule.js'].lineData[162] = 0;
  _$jscoverage['uiModule.js'].lineData[163] = 0;
  _$jscoverage['uiModule.js'].lineData[166] = 0;
  _$jscoverage['uiModule.js'].lineData[167] = 0;
  _$jscoverage['uiModule.js'].lineData[171] = 0;
  _$jscoverage['uiModule.js'].lineData[172] = 0;
  _$jscoverage['uiModule.js'].lineData[173] = 0;
  _$jscoverage['uiModule.js'].lineData[174] = 0;
  _$jscoverage['uiModule.js'].lineData[175] = 0;
  _$jscoverage['uiModule.js'].lineData[176] = 0;
  _$jscoverage['uiModule.js'].lineData[178] = 0;
  _$jscoverage['uiModule.js'].lineData[182] = 0;
  _$jscoverage['uiModule.js'].lineData[183] = 0;
  _$jscoverage['uiModule.js'].lineData[188] = 0;
  _$jscoverage['uiModule.js'].lineData[189] = 0;
  _$jscoverage['uiModule.js'].lineData[191] = 0;
  _$jscoverage['uiModule.js'].lineData[192] = 0;
  _$jscoverage['uiModule.js'].lineData[194] = 0;
  _$jscoverage['uiModule.js'].lineData[196] = 0;
  _$jscoverage['uiModule.js'].lineData[197] = 0;
  _$jscoverage['uiModule.js'].lineData[198] = 0;
  _$jscoverage['uiModule.js'].lineData[199] = 0;
  _$jscoverage['uiModule.js'].lineData[203] = 0;
  _$jscoverage['uiModule.js'].lineData[204] = 0;
  _$jscoverage['uiModule.js'].lineData[205] = 0;
  _$jscoverage['uiModule.js'].lineData[208] = 0;
  _$jscoverage['uiModule.js'].lineData[209] = 0;
  _$jscoverage['uiModule.js'].lineData[210] = 0;
  _$jscoverage['uiModule.js'].lineData[213] = 0;
  _$jscoverage['uiModule.js'].lineData[214] = 0;
  _$jscoverage['uiModule.js'].lineData[218] = 0;
  _$jscoverage['uiModule.js'].lineData[219] = 0;
  _$jscoverage['uiModule.js'].lineData[220] = 0;
  _$jscoverage['uiModule.js'].lineData[221] = 0;
  _$jscoverage['uiModule.js'].lineData[222] = 0;
  _$jscoverage['uiModule.js'].lineData[223] = 0;
  _$jscoverage['uiModule.js'].lineData[224] = 0;
  _$jscoverage['uiModule.js'].lineData[228] = 0;
  _$jscoverage['uiModule.js'].lineData[229] = 0;
  _$jscoverage['uiModule.js'].lineData[234] = 0;
  _$jscoverage['uiModule.js'].lineData[235] = 0;
  _$jscoverage['uiModule.js'].lineData[236] = 0;
  _$jscoverage['uiModule.js'].lineData[239] = 0;
  _$jscoverage['uiModule.js'].lineData[240] = 0;
  _$jscoverage['uiModule.js'].lineData[241] = 0;
  _$jscoverage['uiModule.js'].lineData[242] = 0;
  _$jscoverage['uiModule.js'].lineData[243] = 0;
  _$jscoverage['uiModule.js'].lineData[244] = 0;
  _$jscoverage['uiModule.js'].lineData[250] = 0;
  _$jscoverage['uiModule.js'].lineData[251] = 0;
  _$jscoverage['uiModule.js'].lineData[252] = 0;
  _$jscoverage['uiModule.js'].lineData[253] = 0;
  _$jscoverage['uiModule.js'].lineData[254] = 0;
  _$jscoverage['uiModule.js'].lineData[255] = 0;
  _$jscoverage['uiModule.js'].lineData[256] = 0;
  _$jscoverage['uiModule.js'].lineData[257] = 0;
  _$jscoverage['uiModule.js'].lineData[258] = 0;
  _$jscoverage['uiModule.js'].lineData[259] = 0;
  _$jscoverage['uiModule.js'].lineData[262] = 0;
  _$jscoverage['uiModule.js'].lineData[263] = 0;
  _$jscoverage['uiModule.js'].lineData[266] = 0;
  _$jscoverage['uiModule.js'].lineData[270] = 0;
  _$jscoverage['uiModule.js'].lineData[271] = 0;
  _$jscoverage['uiModule.js'].lineData[272] = 0;
  _$jscoverage['uiModule.js'].lineData[273] = 0;
  _$jscoverage['uiModule.js'].lineData[274] = 0;
  _$jscoverage['uiModule.js'].lineData[275] = 0;
  _$jscoverage['uiModule.js'].lineData[276] = 0;
  _$jscoverage['uiModule.js'].lineData[277] = 0;
  _$jscoverage['uiModule.js'].lineData[278] = 0;
  _$jscoverage['uiModule.js'].lineData[279] = 0;
  _$jscoverage['uiModule.js'].lineData[281] = 0;
  _$jscoverage['uiModule.js'].lineData[282] = 0;
  _$jscoverage['uiModule.js'].lineData[283] = 0;
  _$jscoverage['uiModule.js'].lineData[284] = 0;
  _$jscoverage['uiModule.js'].lineData[285] = 0;
  _$jscoverage['uiModule.js'].lineData[288] = 0;
  _$jscoverage['uiModule.js'].lineData[289] = 0;
  _$jscoverage['uiModule.js'].lineData[290] = 0;
  _$jscoverage['uiModule.js'].lineData[291] = 0;
  _$jscoverage['uiModule.js'].lineData[292] = 0;
  _$jscoverage['uiModule.js'].lineData[293] = 0;
  _$jscoverage['uiModule.js'].lineData[294] = 0;
  _$jscoverage['uiModule.js'].lineData[295] = 0;
  _$jscoverage['uiModule.js'].lineData[297] = 0;
  _$jscoverage['uiModule.js'].lineData[302] = 0;
  _$jscoverage['uiModule.js'].lineData[306] = 0;
  _$jscoverage['uiModule.js'].lineData[307] = 0;
  _$jscoverage['uiModule.js'].lineData[308] = 0;
  _$jscoverage['uiModule.js'].lineData[312] = 0;
  _$jscoverage['uiModule.js'].lineData[313] = 0;
  _$jscoverage['uiModule.js'].lineData[314] = 0;
  _$jscoverage['uiModule.js'].lineData[315] = 0;
  _$jscoverage['uiModule.js'].lineData[316] = 0;
  _$jscoverage['uiModule.js'].lineData[322] = 0;
  _$jscoverage['uiModule.js'].lineData[326] = 0;
  _$jscoverage['uiModule.js'].lineData[329] = 0;
  _$jscoverage['uiModule.js'].lineData[334] = 0;
  _$jscoverage['uiModule.js'].lineData[335] = 0;
  _$jscoverage['uiModule.js'].lineData[336] = 0;
  _$jscoverage['uiModule.js'].lineData[339] = 0;
  _$jscoverage['uiModule.js'].lineData[343] = 0;
  _$jscoverage['uiModule.js'].lineData[346] = 0;
  _$jscoverage['uiModule.js'].lineData[347] = 0;
  _$jscoverage['uiModule.js'].lineData[349] = 0;
  _$jscoverage['uiModule.js'].lineData[351] = 0;
  _$jscoverage['uiModule.js'].lineData[352] = 0;
  _$jscoverage['uiModule.js'].lineData[355] = 0;
  _$jscoverage['uiModule.js'].lineData[356] = 0;
  _$jscoverage['uiModule.js'].lineData[358] = 0;
  _$jscoverage['uiModule.js'].lineData[360] = 0;
  _$jscoverage['uiModule.js'].lineData[364] = 0;
  _$jscoverage['uiModule.js'].lineData[365] = 0;
  _$jscoverage['uiModule.js'].lineData[366] = 0;
  _$jscoverage['uiModule.js'].lineData[369] = 0;
  _$jscoverage['uiModule.js'].lineData[370] = 0;
  _$jscoverage['uiModule.js'].lineData[371] = 0;
  _$jscoverage['uiModule.js'].lineData[373] = 0;
  _$jscoverage['uiModule.js'].lineData[375] = 0;
  _$jscoverage['uiModule.js'].lineData[378] = 0;
  _$jscoverage['uiModule.js'].lineData[379] = 0;
  _$jscoverage['uiModule.js'].lineData[380] = 0;
  _$jscoverage['uiModule.js'].lineData[381] = 0;
  _$jscoverage['uiModule.js'].lineData[384] = 0;
  _$jscoverage['uiModule.js'].lineData[385] = 0;
  _$jscoverage['uiModule.js'].lineData[386] = 0;
  _$jscoverage['uiModule.js'].lineData[387] = 0;
  _$jscoverage['uiModule.js'].lineData[390] = 0;
  _$jscoverage['uiModule.js'].lineData[391] = 0;
  _$jscoverage['uiModule.js'].lineData[392] = 0;
  _$jscoverage['uiModule.js'].lineData[393] = 0;
  _$jscoverage['uiModule.js'].lineData[394] = 0;
  _$jscoverage['uiModule.js'].lineData[395] = 0;
  _$jscoverage['uiModule.js'].lineData[398] = 0;
  _$jscoverage['uiModule.js'].lineData[399] = 0;
  _$jscoverage['uiModule.js'].lineData[400] = 0;
  _$jscoverage['uiModule.js'].lineData[401] = 0;
  _$jscoverage['uiModule.js'].lineData[402] = 0;
  _$jscoverage['uiModule.js'].lineData[405] = 0;
  _$jscoverage['uiModule.js'].lineData[406] = 0;
  _$jscoverage['uiModule.js'].lineData[407] = 0;
  _$jscoverage['uiModule.js'].lineData[408] = 0;
  _$jscoverage['uiModule.js'].lineData[409] = 0;
  _$jscoverage['uiModule.js'].lineData[412] = 0;
  _$jscoverage['uiModule.js'].lineData[414] = 0;
  _$jscoverage['uiModule.js'].lineData[415] = 0;
  _$jscoverage['uiModule.js'].lineData[416] = 0;
  _$jscoverage['uiModule.js'].lineData[417] = 0;
  _$jscoverage['uiModule.js'].lineData[418] = 0;
  _$jscoverage['uiModule.js'].lineData[421] = 0;
  _$jscoverage['uiModule.js'].lineData[423] = 0;
  _$jscoverage['uiModule.js'].lineData[424] = 0;
  _$jscoverage['uiModule.js'].lineData[425] = 0;
  _$jscoverage['uiModule.js'].lineData[426] = 0;
  _$jscoverage['uiModule.js'].lineData[427] = 0;
  _$jscoverage['uiModule.js'].lineData[430] = 0;
  _$jscoverage['uiModule.js'].lineData[432] = 0;
  _$jscoverage['uiModule.js'].lineData[433] = 0;
  _$jscoverage['uiModule.js'].lineData[434] = 0;
  _$jscoverage['uiModule.js'].lineData[435] = 0;
  _$jscoverage['uiModule.js'].lineData[436] = 0;
  _$jscoverage['uiModule.js'].lineData[457] = 0;
  _$jscoverage['uiModule.js'].lineData[458] = 0;
  _$jscoverage['uiModule.js'].lineData[459] = 0;
  _$jscoverage['uiModule.js'].lineData[475] = 0;
  _$jscoverage['uiModule.js'].lineData[476] = 0;
  _$jscoverage['uiModule.js'].lineData[477] = 0;
  _$jscoverage['uiModule.js'].lineData[478] = 0;
  _$jscoverage['uiModule.js'].lineData[479] = 0;
}
if (! _$jscoverage['uiModule.js'].branchData) {
  _$jscoverage['uiModule.js'].branchData = [];
  _$jscoverage['uiModule.js'].branchData[57] = [];
  _$jscoverage['uiModule.js'].branchData[57][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[58] = [];
  _$jscoverage['uiModule.js'].branchData[58][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[74] = [];
  _$jscoverage['uiModule.js'].branchData[74][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[82] = [];
  _$jscoverage['uiModule.js'].branchData[82][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[100] = [];
  _$jscoverage['uiModule.js'].branchData[100][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[111] = [];
  _$jscoverage['uiModule.js'].branchData[111][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[116] = [];
  _$jscoverage['uiModule.js'].branchData[116][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[127] = [];
  _$jscoverage['uiModule.js'].branchData[127][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[147] = [];
  _$jscoverage['uiModule.js'].branchData[147][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[157] = [];
  _$jscoverage['uiModule.js'].branchData[157][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[161] = [];
  _$jscoverage['uiModule.js'].branchData[161][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[172] = [];
  _$jscoverage['uiModule.js'].branchData[172][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[192] = [];
  _$jscoverage['uiModule.js'].branchData[192][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[204] = [];
  _$jscoverage['uiModule.js'].branchData[204][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[208] = [];
  _$jscoverage['uiModule.js'].branchData[208][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[219] = [];
  _$jscoverage['uiModule.js'].branchData[219][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[288] = [];
  _$jscoverage['uiModule.js'].branchData[288][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[290] = [];
  _$jscoverage['uiModule.js'].branchData[290][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[292] = [];
  _$jscoverage['uiModule.js'].branchData[292][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[292][2] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[292][3] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[294] = [];
  _$jscoverage['uiModule.js'].branchData[294][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[313] = [];
  _$jscoverage['uiModule.js'].branchData[313][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[343] = [];
  _$jscoverage['uiModule.js'].branchData[343][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[343][2] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[343][3] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[349] = [];
  _$jscoverage['uiModule.js'].branchData[349][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[349][2] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[349][3] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[356] = [];
  _$jscoverage['uiModule.js'].branchData[356][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[360] = [];
  _$jscoverage['uiModule.js'].branchData[360][1] = new BranchData();
  _$jscoverage['uiModule.js'].branchData[365] = [];
  _$jscoverage['uiModule.js'].branchData[365][1] = new BranchData();
}
_$jscoverage['uiModule.js'].branchData[365][1].init(12, 5, 'debug');
function visit107_365_1(result) {
  _$jscoverage['uiModule.js'].branchData[365][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[360][1].init(16, 5, 'debug');
function visit106_360_1(result) {
  _$jscoverage['uiModule.js'].branchData[360][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[356][1].init(815, 10, 'funcToCall');
function visit105_356_1(result) {
  _$jscoverage['uiModule.js'].branchData[356][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[349][3].init(569, 15, 'browser == "ie"');
function visit104_349_3(result) {
  _$jscoverage['uiModule.js'].branchData[349][3].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[349][2].init(556, 28, '"firefox" || browser == "ie"');
function visit103_349_2(result) {
  _$jscoverage['uiModule.js'].branchData[349][2].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[349][1].init(546, 38, 'browser = "firefox" || browser == "ie"');
function visit102_349_1(result) {
  _$jscoverage['uiModule.js'].branchData[349][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[343][3].init(211, 19, 'browser == "safari"');
function visit101_343_3(result) {
  _$jscoverage['uiModule.js'].branchData[343][3].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[343][2].init(188, 19, 'browser == "chrome"');
function visit100_343_2(result) {
  _$jscoverage['uiModule.js'].branchData[343][2].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[343][1].init(188, 42, 'browser == "chrome" || browser == "safari"');
function visit99_343_1(result) {
  _$jscoverage['uiModule.js'].branchData[343][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[313][1].init(585, 17, 'temp.offsetParent');
function visit98_313_1(result) {
  _$jscoverage['uiModule.js'].branchData[313][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[294][1].init(10647, 47, '\'msTransform\' in document.documentElement.style');
function visit97_294_1(result) {
  _$jscoverage['uiModule.js'].branchData[294][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[292][3].init(10558, 42, 'chrome.webstore && chrome.webstore.install');
function visit96_292_3(result) {
  _$jscoverage['uiModule.js'].branchData[292][3].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[292][2].init(10541, 59, 'window.chrome && chrome.webstore && chrome.webstore.install');
function visit95_292_2(result) {
  _$jscoverage['uiModule.js'].branchData[292][2].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[292][1].init(10538, 63, '!!(window.chrome && chrome.webstore && chrome.webstore.install)');
function visit94_292_1(result) {
  _$jscoverage['uiModule.js'].branchData[292][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[290][1].init(10415, 77, 'Object.prototype.toString.call(window.HTMLElement).indexOf(\'Constructor\') > 0');
function visit93_290_1(result) {
  _$jscoverage['uiModule.js'].branchData[290][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[288][1].init(10320, 48, '\'MozBoxSizing\' in document.documentElement.style');
function visit92_288_1(result) {
  _$jscoverage['uiModule.js'].branchData[288][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[219][1].init(17, 9, 'mouseDown');
function visit91_219_1(result) {
  _$jscoverage['uiModule.js'].branchData[219][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[208][1].init(166, 12, '!buggyCircle');
function visit90_208_1(result) {
  _$jscoverage['uiModule.js'].branchData[208][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[204][1].init(17, 10, '!mouseDown');
function visit89_204_1(result) {
  _$jscoverage['uiModule.js'].branchData[204][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[192][1].init(16, 9, 'mouseDown');
function visit88_192_1(result) {
  _$jscoverage['uiModule.js'].branchData[192][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[172][1].init(17, 9, 'mouseDown');
function visit87_172_1(result) {
  _$jscoverage['uiModule.js'].branchData[172][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[161][1].init(169, 15, '!buggyRectangle');
function visit86_161_1(result) {
  _$jscoverage['uiModule.js'].branchData[161][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[157][1].init(17, 10, '!mouseDown');
function visit85_157_1(result) {
  _$jscoverage['uiModule.js'].branchData[157][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[147][1].init(16, 9, 'mouseDown');
function visit84_147_1(result) {
  _$jscoverage['uiModule.js'].branchData[147][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[127][1].init(17, 9, 'mouseDown');
function visit83_127_1(result) {
  _$jscoverage['uiModule.js'].branchData[127][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[116][1].init(165, 10, '!buggyLine');
function visit82_116_1(result) {
  _$jscoverage['uiModule.js'].branchData[116][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[111][1].init(17, 10, '!mouseDown');
function visit81_111_1(result) {
  _$jscoverage['uiModule.js'].branchData[111][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[100][1].init(16, 9, 'mouseDown');
function visit80_100_1(result) {
  _$jscoverage['uiModule.js'].branchData[100][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[82][1].init(16, 5, 'debug');
function visit79_82_1(result) {
  _$jscoverage['uiModule.js'].branchData[82][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[74][1].init(17, 9, 'mouseDown');
function visit78_74_1(result) {
  _$jscoverage['uiModule.js'].branchData[74][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[58][1].init(20, 5, 'debug');
function visit77_58_1(result) {
  _$jscoverage['uiModule.js'].branchData[58][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].branchData[57][1].init(17, 9, 'mouseDown');
function visit76_57_1(result) {
  _$jscoverage['uiModule.js'].branchData[57][1].ranCondition(result);
  return result;
}_$jscoverage['uiModule.js'].lineData[1]++;
var prevX, prevY, dispCanvas, dispCtx, drawCanvas, drawCtx, clrButton, mouseDown = false, tools = {}, tool, pencilButton, lineButton, rectangleButton, circleButton, fillButton, fillOn = false, colorSelector, buggyCircle = false, buggyCircleButton, buggyRectangle = false, buggyRectangleButton, buggyLine = false, buggyLineButton, dlPngButton, debug = false, currentTool = 'pencil', updateModule;
_$jscoverage['uiModule.js'].lineData[31]++;
var browser, canvTop = 0, canvLeft = 0;
_$jscoverage['uiModule.js'].lineData[36]++;
function initialize() {
  _$jscoverage['uiModule.js'].lineData[38]++;
  updateModule = instantiateUpdateModule(WebSocketRails);
  _$jscoverage['uiModule.js'].lineData[43]++;
  tools.pencil = function() {
  _$jscoverage['uiModule.js'].lineData[44]++;
  var tool = this;
  _$jscoverage['uiModule.js'].lineData[47]++;
  this.mousedown = function(event) {
  _$jscoverage['uiModule.js'].lineData[48]++;
  drawCtx.moveTo(event.relx, event.rely);
  _$jscoverage['uiModule.js'].lineData[49]++;
  mouseDown = true;
  _$jscoverage['uiModule.js'].lineData[50]++;
  prevX = event.relx;
  _$jscoverage['uiModule.js'].lineData[51]++;
  prevY = event.rely;
};
  _$jscoverage['uiModule.js'].lineData[56]++;
  this.mousemove = function(event) {
  _$jscoverage['uiModule.js'].lineData[57]++;
  if (visit76_57_1(mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[58]++;
    if (visit77_58_1(debug)) 
      console.log("calling " + currentTool + ":" + event.type + " with mousedown, drawing at " + event.relx + " " + event.rely);
    _$jscoverage['uiModule.js'].lineData[59]++;
    drawCtx.lineTo(event.relx, event.rely);
    _$jscoverage['uiModule.js'].lineData[60]++;
    drawCtx.stroke();
    _$jscoverage['uiModule.js'].lineData[62]++;
    console.log(drawCanvas);
    _$jscoverage['uiModule.js'].lineData[63]++;
    clearCanvas(drawCanvas);
    _$jscoverage['uiModule.js'].lineData[64]++;
    drawLine(dispCanvas, prevX, prevY, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
    _$jscoverage['uiModule.js'].lineData[66]++;
    updateModule.sendAction("line", prevX, prevY, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
    _$jscoverage['uiModule.js'].lineData[67]++;
    prevX = event.relx;
    _$jscoverage['uiModule.js'].lineData[68]++;
    prevY = event.rely;
  }
};
  _$jscoverage['uiModule.js'].lineData[73]++;
  this.mouseup = function(event) {
  _$jscoverage['uiModule.js'].lineData[74]++;
  if (visit78_74_1(mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[75]++;
    tool.mousemove(event);
    _$jscoverage['uiModule.js'].lineData[76]++;
    mouseDown = false;
    _$jscoverage['uiModule.js'].lineData[77]++;
    drawCtx.beginPath();
  }
};
  _$jscoverage['uiModule.js'].lineData[81]++;
  this.mouseout = function(event) {
  _$jscoverage['uiModule.js'].lineData[82]++;
  if (visit79_82_1(debug)) 
    console.log("exit coords mouseout: " + event.relx + ' ' + event.rely);
  _$jscoverage['uiModule.js'].lineData[83]++;
  event.relx = prevX;
  _$jscoverage['uiModule.js'].lineData[84]++;
  event.rely = prevY;
  _$jscoverage['uiModule.js'].lineData[85]++;
  tool.mouseup(event);
  _$jscoverage['uiModule.js'].lineData[86]++;
  mouseDown = false;
};
  _$jscoverage['uiModule.js'].lineData[89]++;
  this.changeColor = function(color) {
  _$jscoverage['uiModule.js'].lineData[90]++;
  drawCtx.strokeStyle = color;
};
};
  _$jscoverage['uiModule.js'].lineData[95]++;
  tools.line = function() {
  _$jscoverage['uiModule.js'].lineData[96]++;
  var tool = this;
  _$jscoverage['uiModule.js'].lineData[97]++;
  var oldx = 0, oldy = 0;
  _$jscoverage['uiModule.js'].lineData[99]++;
  this.mousedown = function(event) {
  _$jscoverage['uiModule.js'].lineData[100]++;
  if (visit80_100_1(mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[101]++;
    tool.mouseup(event);
  } else {
    _$jscoverage['uiModule.js'].lineData[103]++;
    mouseDown = true;
    _$jscoverage['uiModule.js'].lineData[104]++;
    tool.x0 = event.relx;
    _$jscoverage['uiModule.js'].lineData[105]++;
    tool.y0 = event.rely;
    _$jscoverage['uiModule.js'].lineData[106]++;
    drawCtx.beginPath();
  }
};
  _$jscoverage['uiModule.js'].lineData[110]++;
  this.mousemove = function(event) {
  _$jscoverage['uiModule.js'].lineData[111]++;
  if (visit81_111_1(!mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[112]++;
    return;
  }
  _$jscoverage['uiModule.js'].lineData[116]++;
  if (visit82_116_1(!buggyLine)) {
    _$jscoverage['uiModule.js'].lineData[117]++;
    clearCanvas(drawCanvas);
    _$jscoverage['uiModule.js'].lineData[118]++;
    drawLine(drawCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
  } else {
    _$jscoverage['uiModule.js'].lineData[121]++;
    drawLine(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
    _$jscoverage['uiModule.js'].lineData[122]++;
    updateModule.sendAction("line", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
  }
};
  _$jscoverage['uiModule.js'].lineData[126]++;
  this.mouseup = function(event) {
  _$jscoverage['uiModule.js'].lineData[127]++;
  if (visit83_127_1(mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[128]++;
    tool.mousemove(event);
    _$jscoverage['uiModule.js'].lineData[129]++;
    mouseDown = false;
    _$jscoverage['uiModule.js'].lineData[130]++;
    drawLine(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
    _$jscoverage['uiModule.js'].lineData[131]++;
    clearCanvas(drawCanvas);
    _$jscoverage['uiModule.js'].lineData[133]++;
    updateModule.sendAction("line", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
  }
};
  _$jscoverage['uiModule.js'].lineData[137]++;
  this.changeColor = function(color) {
  _$jscoverage['uiModule.js'].lineData[138]++;
  drawCtx.strokeStyle = color;
};
};
  _$jscoverage['uiModule.js'].lineData[143]++;
  tools.rectangle = function() {
  _$jscoverage['uiModule.js'].lineData[144]++;
  var tool = this;
  _$jscoverage['uiModule.js'].lineData[146]++;
  this.mousedown = function(event) {
  _$jscoverage['uiModule.js'].lineData[147]++;
  if (visit84_147_1(mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[148]++;
    tool.mouseup(event);
  } else {
    _$jscoverage['uiModule.js'].lineData[150]++;
    mouseDown = true;
    _$jscoverage['uiModule.js'].lineData[151]++;
    tool.x0 = event.relx;
    _$jscoverage['uiModule.js'].lineData[152]++;
    tool.y0 = event.rely;
  }
};
  _$jscoverage['uiModule.js'].lineData[156]++;
  this.mousemove = function(event) {
  _$jscoverage['uiModule.js'].lineData[157]++;
  if (visit85_157_1(!mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[158]++;
    return;
  }
  _$jscoverage['uiModule.js'].lineData[161]++;
  if (visit86_161_1(!buggyRectangle)) {
    _$jscoverage['uiModule.js'].lineData[162]++;
    clearCanvas(drawCanvas);
    _$jscoverage['uiModule.js'].lineData[163]++;
    drawRectangle(drawCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
  } else {
    _$jscoverage['uiModule.js'].lineData[166]++;
    drawRectangle(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
    _$jscoverage['uiModule.js'].lineData[167]++;
    updateModule.sendAction("rectangle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
  }
};
  _$jscoverage['uiModule.js'].lineData[171]++;
  this.mouseup = function(event) {
  _$jscoverage['uiModule.js'].lineData[172]++;
  if (visit87_172_1(mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[173]++;
    tool.mousemove(event);
    _$jscoverage['uiModule.js'].lineData[174]++;
    mouseDown = false;
    _$jscoverage['uiModule.js'].lineData[175]++;
    drawRectangle(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
    _$jscoverage['uiModule.js'].lineData[176]++;
    clearCanvas(drawCanvas);
    _$jscoverage['uiModule.js'].lineData[178]++;
    updateModule.sendAction("rectangle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
  }
};
  _$jscoverage['uiModule.js'].lineData[182]++;
  this.changeColor = function(color) {
  _$jscoverage['uiModule.js'].lineData[183]++;
  drawCtx.strokeStyle = color;
};
};
  _$jscoverage['uiModule.js'].lineData[188]++;
  tools.circle = function() {
  _$jscoverage['uiModule.js'].lineData[189]++;
  var tool = this;
  _$jscoverage['uiModule.js'].lineData[191]++;
  this.mousedown = function(event) {
  _$jscoverage['uiModule.js'].lineData[192]++;
  if (visit88_192_1(mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[194]++;
    tool.mouseup(event);
  } else {
    _$jscoverage['uiModule.js'].lineData[196]++;
    mouseDown = true;
    _$jscoverage['uiModule.js'].lineData[197]++;
    tool.x0 = event.relx;
    _$jscoverage['uiModule.js'].lineData[198]++;
    tool.y0 = event.rely;
    _$jscoverage['uiModule.js'].lineData[199]++;
    drawCtx.beginPath();
  }
};
  _$jscoverage['uiModule.js'].lineData[203]++;
  this.mousemove = function(event) {
  _$jscoverage['uiModule.js'].lineData[204]++;
  if (visit89_204_1(!mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[205]++;
    return;
  }
  _$jscoverage['uiModule.js'].lineData[208]++;
  if (visit90_208_1(!buggyCircle)) {
    _$jscoverage['uiModule.js'].lineData[209]++;
    clearCanvas(drawCanvas);
    _$jscoverage['uiModule.js'].lineData[210]++;
    drawCircle(drawCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
  } else {
    _$jscoverage['uiModule.js'].lineData[213]++;
    drawCircle(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
    _$jscoverage['uiModule.js'].lineData[214]++;
    updateModule.sendAction("circle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
  }
};
  _$jscoverage['uiModule.js'].lineData[218]++;
  this.mouseup = function(event) {
  _$jscoverage['uiModule.js'].lineData[219]++;
  if (visit91_219_1(mouseDown)) {
    _$jscoverage['uiModule.js'].lineData[220]++;
    tool.mousemove(event);
    _$jscoverage['uiModule.js'].lineData[221]++;
    mouseDown = false;
    _$jscoverage['uiModule.js'].lineData[222]++;
    drawCircle(dispCanvas, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth, fillOn);
    _$jscoverage['uiModule.js'].lineData[223]++;
    clearCanvas(drawCanvas);
    _$jscoverage['uiModule.js'].lineData[224]++;
    updateModule.sendAction("circle", tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
  }
};
  _$jscoverage['uiModule.js'].lineData[228]++;
  this.changeColor = function(color) {
  _$jscoverage['uiModule.js'].lineData[229]++;
  drawCtx.strokeStyle = color;
};
};
  _$jscoverage['uiModule.js'].lineData[234]++;
  tools.clear = function() {
  _$jscoverage['uiModule.js'].lineData[235]++;
  clearCanvas(dispCanvas);
  _$jscoverage['uiModule.js'].lineData[236]++;
  clearCanvas(drawCanvas);
};
  _$jscoverage['uiModule.js'].lineData[239]++;
  dispCanvas = document.getElementById('myCanvas');
  _$jscoverage['uiModule.js'].lineData[240]++;
  dispCtx = dispCanvas.getContext("2d");
  _$jscoverage['uiModule.js'].lineData[241]++;
  dispCtx.lineCap = "round";
  _$jscoverage['uiModule.js'].lineData[242]++;
  dispCtx.lineJoin = "round";
  _$jscoverage['uiModule.js'].lineData[243]++;
  clrButton = document.getElementById('clear-button');
  _$jscoverage['uiModule.js'].lineData[244]++;
  fillButton = document.getElementById('fill-button');
  _$jscoverage['uiModule.js'].lineData[250]++;
  colorSelector = document.getElementById("color-selector");
  _$jscoverage['uiModule.js'].lineData[251]++;
  pencilButton = document.getElementById("pencil-button");
  _$jscoverage['uiModule.js'].lineData[252]++;
  lineButton = document.getElementById("line-button");
  _$jscoverage['uiModule.js'].lineData[253]++;
  rectangleButton = document.getElementById("rectangle-button");
  _$jscoverage['uiModule.js'].lineData[254]++;
  circleButton = document.getElementById("circle-button");
  _$jscoverage['uiModule.js'].lineData[255]++;
  buggyCircleButton = document.getElementById("buggy-circle-button");
  _$jscoverage['uiModule.js'].lineData[256]++;
  buggyRectangleButton = document.getElementById("buggy-rectangle-button");
  _$jscoverage['uiModule.js'].lineData[257]++;
  buggyLineButton = document.getElementById("buggy-line-button");
  _$jscoverage['uiModule.js'].lineData[258]++;
  debugButton = document.getElementById("debug-button");
  _$jscoverage['uiModule.js'].lineData[259]++;
  dlPngButton = document.getElementById("download-png-button");
  _$jscoverage['uiModule.js'].lineData[262]++;
  updateModule.resetDefaults();
  _$jscoverage['uiModule.js'].lineData[263]++;
  updateModule.setCanvas(dispCanvas);
  _$jscoverage['uiModule.js'].lineData[266]++;
  updateModule.initialize();
  _$jscoverage['uiModule.js'].lineData[270]++;
  var cnvsContainer = dispCanvas.parentNode;
  _$jscoverage['uiModule.js'].lineData[271]++;
  drawCanvas = document.createElement('canvas');
  _$jscoverage['uiModule.js'].lineData[272]++;
  drawCanvas.id = "drawCanvas";
  _$jscoverage['uiModule.js'].lineData[273]++;
  drawCanvas.width = dispCanvas.width;
  _$jscoverage['uiModule.js'].lineData[274]++;
  drawCanvas.height = dispCanvas.height;
  _$jscoverage['uiModule.js'].lineData[275]++;
  drawCanvas.style.border = "3px solid #FFFFFF ";
  _$jscoverage['uiModule.js'].lineData[276]++;
  cnvsContainer.appendChild(drawCanvas);
  _$jscoverage['uiModule.js'].lineData[277]++;
  drawCtx = drawCanvas.getContext('2d');
  _$jscoverage['uiModule.js'].lineData[278]++;
  drawCtx.lineCap = "round";
  _$jscoverage['uiModule.js'].lineData[279]++;
  drawCtx.lineJoin = "round";
  _$jscoverage['uiModule.js'].lineData[281]++;
  drawCanvas.addEventListener('mouseover', handleEvent, false);
  _$jscoverage['uiModule.js'].lineData[282]++;
  drawCanvas.addEventListener('mouseout', handleEvent, false);
  _$jscoverage['uiModule.js'].lineData[283]++;
  drawCanvas.addEventListener('mousedown', handleEvent, false);
  _$jscoverage['uiModule.js'].lineData[284]++;
  drawCanvas.addEventListener('mousemove', handleEvent, false);
  _$jscoverage['uiModule.js'].lineData[285]++;
  drawCanvas.addEventListener('mouseup', handleEvent, false);
  _$jscoverage['uiModule.js'].lineData[288]++;
  if (visit92_288_1('MozBoxSizing' in document.documentElement.style)) {
    _$jscoverage['uiModule.js'].lineData[289]++;
    browser = "firefox";
  } else {
    _$jscoverage['uiModule.js'].lineData[290]++;
    if (visit93_290_1(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)) {
      _$jscoverage['uiModule.js'].lineData[291]++;
      browser = "safari";
    } else {
      _$jscoverage['uiModule.js'].lineData[292]++;
      if (visit94_292_1(!!(visit95_292_2(window.chrome && visit96_292_3(chrome.webstore && chrome.webstore.install))))) {
        _$jscoverage['uiModule.js'].lineData[293]++;
        browser = "chrome";
      } else {
        _$jscoverage['uiModule.js'].lineData[294]++;
        if (visit97_294_1('msTransform' in document.documentElement.style)) {
          _$jscoverage['uiModule.js'].lineData[295]++;
          browser = "ie";
        } else {
          _$jscoverage['uiModule.js'].lineData[297]++;
          browser = "unknown browser";
        }
      }
    }
  }
  _$jscoverage['uiModule.js'].lineData[302]++;
  function windowResize() {
    _$jscoverage['uiModule.js'].lineData[306]++;
    drawCanvas.style.position = "absolute";
    _$jscoverage['uiModule.js'].lineData[307]++;
    drawCanvas.style.top = "0px";
    _$jscoverage['uiModule.js'].lineData[308]++;
    drawCanvas.style.left = "0px";
    _$jscoverage['uiModule.js'].lineData[312]++;
    canvLeft = 0 , canvTop = 0 , temp = dispCanvas;
    _$jscoverage['uiModule.js'].lineData[313]++;
    if (visit98_313_1(temp.offsetParent)) {
      _$jscoverage['uiModule.js'].lineData[314]++;
      do {
        _$jscoverage['uiModule.js'].lineData[315]++;
        canvLeft += temp.offsetLeft;
        _$jscoverage['uiModule.js'].lineData[316]++;
        canvTop += temp.offsetTop;
      } while (temp = temp.offsetParent);
    }
    _$jscoverage['uiModule.js'].lineData[322]++;
    drawCanvas.style.left = canvLeft + "px";
  }
  _$jscoverage['uiModule.js'].lineData[326]++;
  windowResize();
  _$jscoverage['uiModule.js'].lineData[329]++;
  tool = new tools[currentTool]();
  _$jscoverage['uiModule.js'].lineData[334]++;
  function canvasUpdate() {
    _$jscoverage['uiModule.js'].lineData[335]++;
    dispCtx.drawImage(drawCanvas, 0, 0);
    _$jscoverage['uiModule.js'].lineData[336]++;
    clearCanvas(drawCanvas);
  }
  _$jscoverage['uiModule.js'].lineData[339]++;
  function handleEvent(event) {
    _$jscoverage['uiModule.js'].lineData[343]++;
    if (visit99_343_1(visit100_343_2(browser == "chrome") || visit101_343_3(browser == "safari"))) {
      _$jscoverage['uiModule.js'].lineData[346]++;
      event.relx = event.offsetX;
      _$jscoverage['uiModule.js'].lineData[347]++;
      event.rely = event.offsetY;
    } else {
      _$jscoverage['uiModule.js'].lineData[349]++;
      if (visit102_349_1(browser = visit103_349_2("firefox" || visit104_349_3(browser == "ie")))) {
        _$jscoverage['uiModule.js'].lineData[351]++;
        event.relx = event.layerX;
        _$jscoverage['uiModule.js'].lineData[352]++;
        event.rely = event.layerY;
      }
    }
    _$jscoverage['uiModule.js'].lineData[355]++;
    var funcToCall = tool[event.type];
    _$jscoverage['uiModule.js'].lineData[356]++;
    if (visit105_356_1(funcToCall)) {
      _$jscoverage['uiModule.js'].lineData[358]++;
      funcToCall(event);
    } else {
      _$jscoverage['uiModule.js'].lineData[360]++;
      if (visit106_360_1(debug)) 
        console.log(currentTool + " has no associated function " + event.type);
    }
  }
  _$jscoverage['uiModule.js'].lineData[364]++;
  window.onresize = function() {
  _$jscoverage['uiModule.js'].lineData[365]++;
  if (visit107_365_1(debug)) 
    console.log("canvas is resizing");
  _$jscoverage['uiModule.js'].lineData[366]++;
  windowResize();
};
  _$jscoverage['uiModule.js'].lineData[369]++;
  clrButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[370]++;
  clearCanvas(dispCanvas);
  _$jscoverage['uiModule.js'].lineData[371]++;
  clearCanvas(drawCanvas);
  _$jscoverage['uiModule.js'].lineData[373]++;
  updateModule.sendAction("clear", 0, 0, 0, 0, 0, 0);
  _$jscoverage['uiModule.js'].lineData[375]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[378]++;
  fillButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[379]++;
  fillOn = !fillOn;
  _$jscoverage['uiModule.js'].lineData[380]++;
  console.log("fillOn is now: " + fillOn);
  _$jscoverage['uiModule.js'].lineData[381]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[384]++;
  pencilButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[385]++;
  currentTool = "pencil";
  _$jscoverage['uiModule.js'].lineData[386]++;
  tool = new tools[currentTool]();
  _$jscoverage['uiModule.js'].lineData[387]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[390]++;
  lineButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[391]++;
  console.log("here");
  _$jscoverage['uiModule.js'].lineData[392]++;
  buggyLine = false;
  _$jscoverage['uiModule.js'].lineData[393]++;
  currentTool = "line";
  _$jscoverage['uiModule.js'].lineData[394]++;
  tool = new tools[currentTool]();
  _$jscoverage['uiModule.js'].lineData[395]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[398]++;
  rectangleButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[399]++;
  currentTool = "rectangle";
  _$jscoverage['uiModule.js'].lineData[400]++;
  buggyRectangle = false;
  _$jscoverage['uiModule.js'].lineData[401]++;
  tool = new tools[currentTool]();
  _$jscoverage['uiModule.js'].lineData[402]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[405]++;
  circleButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[406]++;
  buggyCircle = false;
  _$jscoverage['uiModule.js'].lineData[407]++;
  currentTool = "circle";
  _$jscoverage['uiModule.js'].lineData[408]++;
  tool = new tools[currentTool]();
  _$jscoverage['uiModule.js'].lineData[409]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[412]++;
  buggyLineButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[414]++;
  drawCtx.beginPath();
  _$jscoverage['uiModule.js'].lineData[415]++;
  buggyLine = true;
  _$jscoverage['uiModule.js'].lineData[416]++;
  currentTool = "line";
  _$jscoverage['uiModule.js'].lineData[417]++;
  tool = new tools[currentTool]();
  _$jscoverage['uiModule.js'].lineData[418]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[421]++;
  buggyCircleButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[423]++;
  drawCtx.beginPath();
  _$jscoverage['uiModule.js'].lineData[424]++;
  buggyCircle = true;
  _$jscoverage['uiModule.js'].lineData[425]++;
  currentTool = "circle";
  _$jscoverage['uiModule.js'].lineData[426]++;
  tool = new tools[currentTool]();
  _$jscoverage['uiModule.js'].lineData[427]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[430]++;
  buggyRectangleButton.onclick = function() {
  _$jscoverage['uiModule.js'].lineData[432]++;
  drawCtx.beginPath();
  _$jscoverage['uiModule.js'].lineData[433]++;
  buggyRectangle = true;
  _$jscoverage['uiModule.js'].lineData[434]++;
  currentTool = "rectangle";
  _$jscoverage['uiModule.js'].lineData[435]++;
  tool = new tools[currentTool]();
  _$jscoverage['uiModule.js'].lineData[436]++;
  return false;
};
  _$jscoverage['uiModule.js'].lineData[457]++;
  colorSelector.onchange = function(event) {
  _$jscoverage['uiModule.js'].lineData[458]++;
  console.log("in here" + colorSelector.value);
  _$jscoverage['uiModule.js'].lineData[459]++;
  tool.changeColor(colorSelector.value);
};
  _$jscoverage['uiModule.js'].lineData[475]++;
  console.log(dlPngButton);
  _$jscoverage['uiModule.js'].lineData[476]++;
  dlPngButton.onclick = function(event) {
  _$jscoverage['uiModule.js'].lineData[477]++;
  Canvas2Image.saveAsPNG(dispCanvas);
  _$jscoverage['uiModule.js'].lineData[478]++;
  document.getElementById('canvas-message2').innerHTML = "Thanks for download the image, plese rename file to <filename>.png to view";
  _$jscoverage['uiModule.js'].lineData[479]++;
  return false;
};
}
