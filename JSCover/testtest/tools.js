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
if (! _$jscoverage['tools.js']) {
  _$jscoverage['tools.js'] = {};
  _$jscoverage['tools.js'].lineData = [];
  _$jscoverage['tools.js'].lineData[1] = 0;
  _$jscoverage['tools.js'].lineData[27] = 0;
  _$jscoverage['tools.js'].lineData[32] = 0;
  _$jscoverage['tools.js'].lineData[34] = 0;
  _$jscoverage['tools.js'].lineData[39] = 0;
  _$jscoverage['tools.js'].lineData[40] = 0;
  _$jscoverage['tools.js'].lineData[43] = 0;
  _$jscoverage['tools.js'].lineData[44] = 0;
  _$jscoverage['tools.js'].lineData[45] = 0;
  _$jscoverage['tools.js'].lineData[46] = 0;
  _$jscoverage['tools.js'].lineData[47] = 0;
  _$jscoverage['tools.js'].lineData[52] = 0;
  _$jscoverage['tools.js'].lineData[53] = 0;
  _$jscoverage['tools.js'].lineData[54] = 0;
  _$jscoverage['tools.js'].lineData[55] = 0;
  _$jscoverage['tools.js'].lineData[56] = 0;
  _$jscoverage['tools.js'].lineData[58] = 0;
  _$jscoverage['tools.js'].lineData[59] = 0;
  _$jscoverage['tools.js'].lineData[63] = 0;
  _$jscoverage['tools.js'].lineData[64] = 0;
  _$jscoverage['tools.js'].lineData[69] = 0;
  _$jscoverage['tools.js'].lineData[70] = 0;
  _$jscoverage['tools.js'].lineData[71] = 0;
  _$jscoverage['tools.js'].lineData[72] = 0;
  _$jscoverage['tools.js'].lineData[73] = 0;
  _$jscoverage['tools.js'].lineData[77] = 0;
  _$jscoverage['tools.js'].lineData[78] = 0;
  _$jscoverage['tools.js'].lineData[79] = 0;
  _$jscoverage['tools.js'].lineData[80] = 0;
  _$jscoverage['tools.js'].lineData[81] = 0;
  _$jscoverage['tools.js'].lineData[82] = 0;
  _$jscoverage['tools.js'].lineData[85] = 0;
  _$jscoverage['tools.js'].lineData[86] = 0;
  _$jscoverage['tools.js'].lineData[91] = 0;
  _$jscoverage['tools.js'].lineData[92] = 0;
  _$jscoverage['tools.js'].lineData[93] = 0;
  _$jscoverage['tools.js'].lineData[107] = 0;
  _$jscoverage['tools.js'].lineData[108] = 0;
  _$jscoverage['tools.js'].lineData[109] = 0;
  _$jscoverage['tools.js'].lineData[111] = 0;
  _$jscoverage['tools.js'].lineData[112] = 0;
  _$jscoverage['tools.js'].lineData[113] = 0;
  _$jscoverage['tools.js'].lineData[114] = 0;
  _$jscoverage['tools.js'].lineData[118] = 0;
  _$jscoverage['tools.js'].lineData[119] = 0;
  _$jscoverage['tools.js'].lineData[120] = 0;
  _$jscoverage['tools.js'].lineData[123] = 0;
  _$jscoverage['tools.js'].lineData[124] = 0;
  _$jscoverage['tools.js'].lineData[125] = 0;
  _$jscoverage['tools.js'].lineData[126] = 0;
  _$jscoverage['tools.js'].lineData[127] = 0;
  _$jscoverage['tools.js'].lineData[131] = 0;
  _$jscoverage['tools.js'].lineData[132] = 0;
  _$jscoverage['tools.js'].lineData[133] = 0;
  _$jscoverage['tools.js'].lineData[134] = 0;
  _$jscoverage['tools.js'].lineData[136] = 0;
  _$jscoverage['tools.js'].lineData[137] = 0;
  _$jscoverage['tools.js'].lineData[143] = 0;
  _$jscoverage['tools.js'].lineData[144] = 0;
  _$jscoverage['tools.js'].lineData[149] = 0;
  _$jscoverage['tools.js'].lineData[150] = 0;
  _$jscoverage['tools.js'].lineData[164] = 0;
  _$jscoverage['tools.js'].lineData[165] = 0;
  _$jscoverage['tools.js'].lineData[166] = 0;
  _$jscoverage['tools.js'].lineData[168] = 0;
  _$jscoverage['tools.js'].lineData[169] = 0;
  _$jscoverage['tools.js'].lineData[170] = 0;
  _$jscoverage['tools.js'].lineData[174] = 0;
  _$jscoverage['tools.js'].lineData[175] = 0;
  _$jscoverage['tools.js'].lineData[176] = 0;
  _$jscoverage['tools.js'].lineData[178] = 0;
  _$jscoverage['tools.js'].lineData[183] = 0;
  _$jscoverage['tools.js'].lineData[185] = 0;
  _$jscoverage['tools.js'].lineData[186] = 0;
  _$jscoverage['tools.js'].lineData[189] = 0;
  _$jscoverage['tools.js'].lineData[192] = 0;
  _$jscoverage['tools.js'].lineData[193] = 0;
  _$jscoverage['tools.js'].lineData[194] = 0;
  _$jscoverage['tools.js'].lineData[195] = 0;
  _$jscoverage['tools.js'].lineData[196] = 0;
  _$jscoverage['tools.js'].lineData[197] = 0;
  _$jscoverage['tools.js'].lineData[203] = 0;
  _$jscoverage['tools.js'].lineData[204] = 0;
  _$jscoverage['tools.js'].lineData[209] = 0;
  _$jscoverage['tools.js'].lineData[210] = 0;
  _$jscoverage['tools.js'].lineData[227] = 0;
  _$jscoverage['tools.js'].lineData[228] = 0;
  _$jscoverage['tools.js'].lineData[230] = 0;
  _$jscoverage['tools.js'].lineData[232] = 0;
  _$jscoverage['tools.js'].lineData[233] = 0;
  _$jscoverage['tools.js'].lineData[234] = 0;
  _$jscoverage['tools.js'].lineData[235] = 0;
  _$jscoverage['tools.js'].lineData[239] = 0;
  _$jscoverage['tools.js'].lineData[240] = 0;
  _$jscoverage['tools.js'].lineData[241] = 0;
  _$jscoverage['tools.js'].lineData[244] = 0;
  _$jscoverage['tools.js'].lineData[245] = 0;
  _$jscoverage['tools.js'].lineData[247] = 0;
  _$jscoverage['tools.js'].lineData[249] = 0;
  _$jscoverage['tools.js'].lineData[251] = 0;
  _$jscoverage['tools.js'].lineData[252] = 0;
  _$jscoverage['tools.js'].lineData[253] = 0;
  _$jscoverage['tools.js'].lineData[256] = 0;
  _$jscoverage['tools.js'].lineData[257] = 0;
  _$jscoverage['tools.js'].lineData[258] = 0;
  _$jscoverage['tools.js'].lineData[259] = 0;
  _$jscoverage['tools.js'].lineData[260] = 0;
  _$jscoverage['tools.js'].lineData[261] = 0;
  _$jscoverage['tools.js'].lineData[266] = 0;
  _$jscoverage['tools.js'].lineData[267] = 0;
  _$jscoverage['tools.js'].lineData[272] = 0;
  _$jscoverage['tools.js'].lineData[273] = 0;
  _$jscoverage['tools.js'].lineData[274] = 0;
  _$jscoverage['tools.js'].lineData[277] = 0;
  _$jscoverage['tools.js'].lineData[278] = 0;
  _$jscoverage['tools.js'].lineData[279] = 0;
  _$jscoverage['tools.js'].lineData[280] = 0;
  _$jscoverage['tools.js'].lineData[281] = 0;
  _$jscoverage['tools.js'].lineData[282] = 0;
  _$jscoverage['tools.js'].lineData[283] = 0;
  _$jscoverage['tools.js'].lineData[285] = 0;
  _$jscoverage['tools.js'].lineData[286] = 0;
  _$jscoverage['tools.js'].lineData[287] = 0;
  _$jscoverage['tools.js'].lineData[288] = 0;
  _$jscoverage['tools.js'].lineData[289] = 0;
  _$jscoverage['tools.js'].lineData[290] = 0;
  _$jscoverage['tools.js'].lineData[291] = 0;
  _$jscoverage['tools.js'].lineData[292] = 0;
  _$jscoverage['tools.js'].lineData[293] = 0;
  _$jscoverage['tools.js'].lineData[298] = 0;
  _$jscoverage['tools.js'].lineData[299] = 0;
  _$jscoverage['tools.js'].lineData[300] = 0;
  _$jscoverage['tools.js'].lineData[301] = 0;
  _$jscoverage['tools.js'].lineData[302] = 0;
  _$jscoverage['tools.js'].lineData[303] = 0;
  _$jscoverage['tools.js'].lineData[304] = 0;
  _$jscoverage['tools.js'].lineData[305] = 0;
  _$jscoverage['tools.js'].lineData[306] = 0;
  _$jscoverage['tools.js'].lineData[307] = 0;
  _$jscoverage['tools.js'].lineData[309] = 0;
  _$jscoverage['tools.js'].lineData[310] = 0;
  _$jscoverage['tools.js'].lineData[311] = 0;
  _$jscoverage['tools.js'].lineData[312] = 0;
  _$jscoverage['tools.js'].lineData[313] = 0;
  _$jscoverage['tools.js'].lineData[316] = 0;
  _$jscoverage['tools.js'].lineData[317] = 0;
  _$jscoverage['tools.js'].lineData[318] = 0;
  _$jscoverage['tools.js'].lineData[319] = 0;
  _$jscoverage['tools.js'].lineData[320] = 0;
  _$jscoverage['tools.js'].lineData[321] = 0;
  _$jscoverage['tools.js'].lineData[322] = 0;
  _$jscoverage['tools.js'].lineData[323] = 0;
  _$jscoverage['tools.js'].lineData[325] = 0;
  _$jscoverage['tools.js'].lineData[330] = 0;
  _$jscoverage['tools.js'].lineData[334] = 0;
  _$jscoverage['tools.js'].lineData[335] = 0;
  _$jscoverage['tools.js'].lineData[336] = 0;
  _$jscoverage['tools.js'].lineData[340] = 0;
  _$jscoverage['tools.js'].lineData[341] = 0;
  _$jscoverage['tools.js'].lineData[342] = 0;
  _$jscoverage['tools.js'].lineData[343] = 0;
  _$jscoverage['tools.js'].lineData[344] = 0;
  _$jscoverage['tools.js'].lineData[350] = 0;
  _$jscoverage['tools.js'].lineData[354] = 0;
  _$jscoverage['tools.js'].lineData[357] = 0;
  _$jscoverage['tools.js'].lineData[362] = 0;
  _$jscoverage['tools.js'].lineData[363] = 0;
  _$jscoverage['tools.js'].lineData[364] = 0;
  _$jscoverage['tools.js'].lineData[367] = 0;
  _$jscoverage['tools.js'].lineData[368] = 0;
  _$jscoverage['tools.js'].lineData[369] = 0;
  _$jscoverage['tools.js'].lineData[372] = 0;
  _$jscoverage['tools.js'].lineData[376] = 0;
  _$jscoverage['tools.js'].lineData[389] = 0;
  _$jscoverage['tools.js'].lineData[390] = 0;
  _$jscoverage['tools.js'].lineData[392] = 0;
  _$jscoverage['tools.js'].lineData[394] = 0;
  _$jscoverage['tools.js'].lineData[395] = 0;
  _$jscoverage['tools.js'].lineData[398] = 0;
  _$jscoverage['tools.js'].lineData[399] = 0;
  _$jscoverage['tools.js'].lineData[401] = 0;
  _$jscoverage['tools.js'].lineData[403] = 0;
  _$jscoverage['tools.js'].lineData[407] = 0;
  _$jscoverage['tools.js'].lineData[408] = 0;
  _$jscoverage['tools.js'].lineData[409] = 0;
  _$jscoverage['tools.js'].lineData[412] = 0;
  _$jscoverage['tools.js'].lineData[413] = 0;
  _$jscoverage['tools.js'].lineData[416] = 0;
  _$jscoverage['tools.js'].lineData[418] = 0;
  _$jscoverage['tools.js'].lineData[422] = 0;
  _$jscoverage['tools.js'].lineData[423] = 0;
  _$jscoverage['tools.js'].lineData[424] = 0;
  _$jscoverage['tools.js'].lineData[425] = 0;
  _$jscoverage['tools.js'].lineData[428] = 0;
  _$jscoverage['tools.js'].lineData[429] = 0;
  _$jscoverage['tools.js'].lineData[430] = 0;
  _$jscoverage['tools.js'].lineData[431] = 0;
  _$jscoverage['tools.js'].lineData[432] = 0;
  _$jscoverage['tools.js'].lineData[433] = 0;
  _$jscoverage['tools.js'].lineData[436] = 0;
  _$jscoverage['tools.js'].lineData[437] = 0;
  _$jscoverage['tools.js'].lineData[438] = 0;
  _$jscoverage['tools.js'].lineData[439] = 0;
  _$jscoverage['tools.js'].lineData[442] = 0;
  _$jscoverage['tools.js'].lineData[443] = 0;
  _$jscoverage['tools.js'].lineData[444] = 0;
  _$jscoverage['tools.js'].lineData[445] = 0;
  _$jscoverage['tools.js'].lineData[446] = 0;
  _$jscoverage['tools.js'].lineData[449] = 0;
  _$jscoverage['tools.js'].lineData[451] = 0;
  _$jscoverage['tools.js'].lineData[452] = 0;
  _$jscoverage['tools.js'].lineData[453] = 0;
  _$jscoverage['tools.js'].lineData[454] = 0;
  _$jscoverage['tools.js'].lineData[455] = 0;
  _$jscoverage['tools.js'].lineData[458] = 0;
  _$jscoverage['tools.js'].lineData[460] = 0;
  _$jscoverage['tools.js'].lineData[461] = 0;
  _$jscoverage['tools.js'].lineData[462] = 0;
  _$jscoverage['tools.js'].lineData[463] = 0;
  _$jscoverage['tools.js'].lineData[464] = 0;
  _$jscoverage['tools.js'].lineData[467] = 0;
  _$jscoverage['tools.js'].lineData[468] = 0;
  _$jscoverage['tools.js'].lineData[469] = 0;
  _$jscoverage['tools.js'].lineData[472] = 0;
  _$jscoverage['tools.js'].lineData[473] = 0;
  _$jscoverage['tools.js'].lineData[474] = 0;
  _$jscoverage['tools.js'].lineData[477] = 0;
  _$jscoverage['tools.js'].lineData[478] = 0;
  _$jscoverage['tools.js'].lineData[479] = 0;
  _$jscoverage['tools.js'].lineData[491] = 0;
  _$jscoverage['tools.js'].lineData[492] = 0;
  _$jscoverage['tools.js'].lineData[493] = 0;
  _$jscoverage['tools.js'].lineData[498] = 0;
  _$jscoverage['tools.js'].lineData[499] = 0;
  _$jscoverage['tools.js'].lineData[500] = 0;
  _$jscoverage['tools.js'].lineData[501] = 0;
  _$jscoverage['tools.js'].lineData[502] = 0;
  _$jscoverage['tools.js'].lineData[507] = 0;
  _$jscoverage['tools.js'].lineData[508] = 0;
  _$jscoverage['tools.js'].lineData[509] = 0;
  _$jscoverage['tools.js'].lineData[510] = 0;
  _$jscoverage['tools.js'].lineData[511] = 0;
  _$jscoverage['tools.js'].lineData[514] = 0;
  _$jscoverage['tools.js'].lineData[515] = 0;
  _$jscoverage['tools.js'].lineData[516] = 0;
  _$jscoverage['tools.js'].lineData[517] = 0;
  _$jscoverage['tools.js'].lineData[518] = 0;
  _$jscoverage['tools.js'].lineData[519] = 0;
  _$jscoverage['tools.js'].lineData[521] = 0;
  _$jscoverage['tools.js'].lineData[523] = 0;
}
if (! _$jscoverage['tools.js'].branchData) {
  _$jscoverage['tools.js'].branchData = [];
  _$jscoverage['tools.js'].branchData[53] = [];
  _$jscoverage['tools.js'].branchData[53][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[54] = [];
  _$jscoverage['tools.js'].branchData[54][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[70] = [];
  _$jscoverage['tools.js'].branchData[70][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[78] = [];
  _$jscoverage['tools.js'].branchData[78][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[108] = [];
  _$jscoverage['tools.js'].branchData[108][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[119] = [];
  _$jscoverage['tools.js'].branchData[119][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[123] = [];
  _$jscoverage['tools.js'].branchData[123][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[132] = [];
  _$jscoverage['tools.js'].branchData[132][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[165] = [];
  _$jscoverage['tools.js'].branchData[165][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[175] = [];
  _$jscoverage['tools.js'].branchData[175][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[185] = [];
  _$jscoverage['tools.js'].branchData[185][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[193] = [];
  _$jscoverage['tools.js'].branchData[193][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[228] = [];
  _$jscoverage['tools.js'].branchData[228][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[240] = [];
  _$jscoverage['tools.js'].branchData[240][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[251] = [];
  _$jscoverage['tools.js'].branchData[251][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[257] = [];
  _$jscoverage['tools.js'].branchData[257][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[316] = [];
  _$jscoverage['tools.js'].branchData[316][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[318] = [];
  _$jscoverage['tools.js'].branchData[318][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[320] = [];
  _$jscoverage['tools.js'].branchData[320][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[320][2] = new BranchData();
  _$jscoverage['tools.js'].branchData[320][3] = new BranchData();
  _$jscoverage['tools.js'].branchData[322] = [];
  _$jscoverage['tools.js'].branchData[322][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[341] = [];
  _$jscoverage['tools.js'].branchData[341][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[376] = [];
  _$jscoverage['tools.js'].branchData[376][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[376][2] = new BranchData();
  _$jscoverage['tools.js'].branchData[376][3] = new BranchData();
  _$jscoverage['tools.js'].branchData[392] = [];
  _$jscoverage['tools.js'].branchData[392][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[392][2] = new BranchData();
  _$jscoverage['tools.js'].branchData[392][3] = new BranchData();
  _$jscoverage['tools.js'].branchData[399] = [];
  _$jscoverage['tools.js'].branchData[399][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[403] = [];
  _$jscoverage['tools.js'].branchData[403][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[408] = [];
  _$jscoverage['tools.js'].branchData[408][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[499] = [];
  _$jscoverage['tools.js'].branchData[499][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[516] = [];
  _$jscoverage['tools.js'].branchData[516][1] = new BranchData();
  _$jscoverage['tools.js'].branchData[519] = [];
  _$jscoverage['tools.js'].branchData[519][1] = new BranchData();
}
_$jscoverage['tools.js'].branchData[519][1].init(132, 7, 'canvTop');
function visit70_519_1(result) {
  _$jscoverage['tools.js'].branchData[519][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[516][1].init(38, 5, 'debug');
function visit69_516_1(result) {
  _$jscoverage['tools.js'].branchData[516][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[499][1].init(13, 19, 'event.keyCode == 13');
function visit68_499_1(result) {
  _$jscoverage['tools.js'].branchData[499][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[408][1].init(13, 5, 'debug');
function visit67_408_1(result) {
  _$jscoverage['tools.js'].branchData[408][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[403][1].init(17, 5, 'debug');
function visit66_403_1(result) {
  _$jscoverage['tools.js'].branchData[403][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[399][1].init(1321, 10, 'funcToCall');
function visit65_399_1(result) {
  _$jscoverage['tools.js'].branchData[399][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[392][3].init(1068, 15, 'browser == "ie"');
function visit64_392_3(result) {
  _$jscoverage['tools.js'].branchData[392][3].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[392][2].init(1055, 28, '"firefox" || browser == "ie"');
function visit63_392_2(result) {
  _$jscoverage['tools.js'].branchData[392][2].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[392][1].init(1045, 38, 'browser = "firefox" || browser == "ie"');
function visit62_392_1(result) {
  _$jscoverage['tools.js'].branchData[392][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[376][3].init(215, 19, 'browser == "safari"');
function visit61_376_3(result) {
  _$jscoverage['tools.js'].branchData[376][3].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[376][2].init(192, 19, 'browser == "chrome"');
function visit60_376_2(result) {
  _$jscoverage['tools.js'].branchData[376][2].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[376][1].init(192, 42, 'browser == "chrome" || browser == "safari"');
function visit59_376_1(result) {
  _$jscoverage['tools.js'].branchData[376][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[341][1].init(596, 17, 'temp.offsetParent');
function visit58_341_1(result) {
  _$jscoverage['tools.js'].branchData[341][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[322][1].init(10485, 47, '\'msTransform\' in document.documentElement.style');
function visit57_322_1(result) {
  _$jscoverage['tools.js'].branchData[322][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[320][3].init(10394, 42, 'chrome.webstore && chrome.webstore.install');
function visit56_320_3(result) {
  _$jscoverage['tools.js'].branchData[320][3].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[320][2].init(10377, 59, 'window.chrome && chrome.webstore && chrome.webstore.install');
function visit55_320_2(result) {
  _$jscoverage['tools.js'].branchData[320][2].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[320][1].init(10374, 63, '!!(window.chrome && chrome.webstore && chrome.webstore.install)');
function visit54_320_1(result) {
  _$jscoverage['tools.js'].branchData[320][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[318][1].init(10249, 77, 'Object.prototype.toString.call(window.HTMLElement).indexOf(\'Constructor\') > 0');
function visit53_318_1(result) {
  _$jscoverage['tools.js'].branchData[318][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[316][1].init(10152, 48, '\'MozBoxSizing\' in document.documentElement.style');
function visit52_316_1(result) {
  _$jscoverage['tools.js'].branchData[316][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[257][1].init(18, 9, 'mouseDown');
function visit51_257_1(result) {
  _$jscoverage['tools.js'].branchData[257][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[251][1].init(361, 12, '!buggyCircle');
function visit50_251_1(result) {
  _$jscoverage['tools.js'].branchData[251][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[240][1].init(18, 10, '!mouseDown');
function visit49_240_1(result) {
  _$jscoverage['tools.js'].branchData[240][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[228][1].init(17, 9, 'mouseDown');
function visit48_228_1(result) {
  _$jscoverage['tools.js'].branchData[228][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[193][1].init(18, 9, 'mouseDown');
function visit47_193_1(result) {
  _$jscoverage['tools.js'].branchData[193][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[185][1].init(368, 8, '!w || !h');
function visit46_185_1(result) {
  _$jscoverage['tools.js'].branchData[185][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[175][1].init(18, 10, '!mouseDown');
function visit45_175_1(result) {
  _$jscoverage['tools.js'].branchData[175][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[165][1].init(17, 9, 'mouseDown');
function visit44_165_1(result) {
  _$jscoverage['tools.js'].branchData[165][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[132][1].init(18, 9, 'mouseDown');
function visit43_132_1(result) {
  _$jscoverage['tools.js'].branchData[132][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[123][1].init(90, 10, '!buggyLine');
function visit42_123_1(result) {
  _$jscoverage['tools.js'].branchData[123][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[119][1].init(18, 10, '!mouseDown');
function visit41_119_1(result) {
  _$jscoverage['tools.js'].branchData[119][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[108][1].init(17, 9, 'mouseDown');
function visit40_108_1(result) {
  _$jscoverage['tools.js'].branchData[108][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[78][1].init(17, 5, 'debug');
function visit39_78_1(result) {
  _$jscoverage['tools.js'].branchData[78][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[70][1].init(18, 9, 'mouseDown');
function visit38_70_1(result) {
  _$jscoverage['tools.js'].branchData[70][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[54][1].init(21, 5, 'debug');
function visit37_54_1(result) {
  _$jscoverage['tools.js'].branchData[54][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].branchData[53][1].init(18, 9, 'mouseDown');
function visit36_53_1(result) {
  _$jscoverage['tools.js'].branchData[53][1].ranCondition(result);
  return result;
}_$jscoverage['tools.js'].lineData[1]++;
var prevX, prevY, dispCanvas, dispCtx, drawCanvas, drawCtx, clrButton, mouseDown = false, tools = {}, tool, pencilButton, lineButton, rectangleButton, circleButton, blackButton, blueButton, redButton, lineThicknessBox, colorBox, colorSelector, buggyCircle = false, buggyCircleButton, buggyLine = false, buggyLineButton, dlPngButton, debug = false, currentTool = 'pencil', updateModule;
_$jscoverage['tools.js'].lineData[27]++;
var browser, canvTop = 0, canvLeft = 0;
_$jscoverage['tools.js'].lineData[32]++;
function initialize() {
  _$jscoverage['tools.js'].lineData[34]++;
  updateModule = instantiateUpdateModule();
  _$jscoverage['tools.js'].lineData[39]++;
  tools.pencil = function() {
  _$jscoverage['tools.js'].lineData[40]++;
  var tool = this;
  _$jscoverage['tools.js'].lineData[43]++;
  this.mousedown = function(event) {
  _$jscoverage['tools.js'].lineData[44]++;
  drawCtx.moveTo(event.relx, event.rely);
  _$jscoverage['tools.js'].lineData[45]++;
  mouseDown = true;
  _$jscoverage['tools.js'].lineData[46]++;
  prevX = event.relx;
  _$jscoverage['tools.js'].lineData[47]++;
  prevY = event.rely;
};
  _$jscoverage['tools.js'].lineData[52]++;
  this.mousemove = function(event) {
  _$jscoverage['tools.js'].lineData[53]++;
  if (visit36_53_1(mouseDown)) {
    _$jscoverage['tools.js'].lineData[54]++;
    if (visit37_54_1(debug)) 
      console.log("calling " + currentTool + ":" + event.type + " with mousedown, drawing at " + event.relx + " " + event.rely);
    _$jscoverage['tools.js'].lineData[55]++;
    drawCtx.lineTo(event.relx, event.rely);
    _$jscoverage['tools.js'].lineData[56]++;
    drawCtx.stroke();
    _$jscoverage['tools.js'].lineData[58]++;
    clearCanvas(drawCtx);
    _$jscoverage['tools.js'].lineData[59]++;
    drawLine(dispCtx, prevX, prevY, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
    _$jscoverage['tools.js'].lineData[63]++;
    prevX = event.relx;
    _$jscoverage['tools.js'].lineData[64]++;
    prevY = event.rely;
  }
};
  _$jscoverage['tools.js'].lineData[69]++;
  this.mouseup = function(event) {
  _$jscoverage['tools.js'].lineData[70]++;
  if (visit38_70_1(mouseDown)) {
    _$jscoverage['tools.js'].lineData[71]++;
    tool.mousemove(event);
    _$jscoverage['tools.js'].lineData[72]++;
    mouseDown = false;
    _$jscoverage['tools.js'].lineData[73]++;
    drawCtx.beginPath();
  }
};
  _$jscoverage['tools.js'].lineData[77]++;
  this.mouseout = function(event) {
  _$jscoverage['tools.js'].lineData[78]++;
  if (visit39_78_1(debug)) 
    console.log("exit coords mouseout: " + event.relx + ' ' + event.rely);
  _$jscoverage['tools.js'].lineData[79]++;
  event.relx = prevX;
  _$jscoverage['tools.js'].lineData[80]++;
  event.rely = prevY;
  _$jscoverage['tools.js'].lineData[81]++;
  tool.mouseup(event);
  _$jscoverage['tools.js'].lineData[82]++;
  mouseDown = false;
};
  _$jscoverage['tools.js'].lineData[85]++;
  this.changeColor = function(color) {
  _$jscoverage['tools.js'].lineData[86]++;
  drawCtx.strokeStyle = color;
};
};
  _$jscoverage['tools.js'].lineData[91]++;
  tools.line = function() {
  _$jscoverage['tools.js'].lineData[92]++;
  var tool = this;
  _$jscoverage['tools.js'].lineData[93]++;
  var oldx = 0, oldy = 0;
  _$jscoverage['tools.js'].lineData[107]++;
  this.mousedown = function(event) {
  _$jscoverage['tools.js'].lineData[108]++;
  if (visit40_108_1(mouseDown)) {
    _$jscoverage['tools.js'].lineData[109]++;
    tool.mouseup(event);
  } else {
    _$jscoverage['tools.js'].lineData[111]++;
    mouseDown = true;
    _$jscoverage['tools.js'].lineData[112]++;
    tool.x0 = event.relx;
    _$jscoverage['tools.js'].lineData[113]++;
    tool.y0 = event.rely;
    _$jscoverage['tools.js'].lineData[114]++;
    drawCtx.beginPath();
  }
};
  _$jscoverage['tools.js'].lineData[118]++;
  this.mousemove = function(event) {
  _$jscoverage['tools.js'].lineData[119]++;
  if (visit41_119_1(!mouseDown)) {
    _$jscoverage['tools.js'].lineData[120]++;
    return;
  }
  _$jscoverage['tools.js'].lineData[123]++;
  if (visit42_123_1(!buggyLine)) 
    drawCtx.beginPath();
  _$jscoverage['tools.js'].lineData[124]++;
  drawCtx.moveTo(tool.x0, tool.y0);
  _$jscoverage['tools.js'].lineData[125]++;
  drawCtx.lineTo(event.relx, event.rely);
  _$jscoverage['tools.js'].lineData[126]++;
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  _$jscoverage['tools.js'].lineData[127]++;
  drawCtx.stroke();
};
  _$jscoverage['tools.js'].lineData[131]++;
  this.mouseup = function(event) {
  _$jscoverage['tools.js'].lineData[132]++;
  if (visit43_132_1(mouseDown)) {
    _$jscoverage['tools.js'].lineData[133]++;
    tool.mousemove(event);
    _$jscoverage['tools.js'].lineData[134]++;
    mouseDown = false;
    _$jscoverage['tools.js'].lineData[136]++;
    drawLine(dispCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
    _$jscoverage['tools.js'].lineData[137]++;
    clearCanvas(drawCtx);
  }
};
  _$jscoverage['tools.js'].lineData[143]++;
  this.changeColor = function(color) {
  _$jscoverage['tools.js'].lineData[144]++;
  drawCtx.strokeStyle = color;
};
};
  _$jscoverage['tools.js'].lineData[149]++;
  tools.rectangle = function() {
  _$jscoverage['tools.js'].lineData[150]++;
  var tool = this;
  _$jscoverage['tools.js'].lineData[164]++;
  this.mousedown = function(event) {
  _$jscoverage['tools.js'].lineData[165]++;
  if (visit44_165_1(mouseDown)) {
    _$jscoverage['tools.js'].lineData[166]++;
    tool.mouseup(event);
  } else {
    _$jscoverage['tools.js'].lineData[168]++;
    mouseDown = true;
    _$jscoverage['tools.js'].lineData[169]++;
    tool.x0 = event.relx;
    _$jscoverage['tools.js'].lineData[170]++;
    tool.y0 = event.rely;
  }
};
  _$jscoverage['tools.js'].lineData[174]++;
  this.mousemove = function(event) {
  _$jscoverage['tools.js'].lineData[175]++;
  if (visit45_175_1(!mouseDown)) {
    _$jscoverage['tools.js'].lineData[176]++;
    return;
  }
  _$jscoverage['tools.js'].lineData[178]++;
  var x = Math.min(event.relx, tool.x0), y = Math.min(event.rely, tool.y0), w = Math.abs(event.relx - tool.x0), h = Math.abs(event.rely - tool.y0);
  _$jscoverage['tools.js'].lineData[183]++;
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  _$jscoverage['tools.js'].lineData[185]++;
  if (visit46_185_1(!w || !h)) {
    _$jscoverage['tools.js'].lineData[186]++;
    return;
  }
  _$jscoverage['tools.js'].lineData[189]++;
  drawCtx.strokeRect(x, y, w, h);
};
  _$jscoverage['tools.js'].lineData[192]++;
  this.mouseup = function(event) {
  _$jscoverage['tools.js'].lineData[193]++;
  if (visit47_193_1(mouseDown)) {
    _$jscoverage['tools.js'].lineData[194]++;
    tool.mousemove(event);
    _$jscoverage['tools.js'].lineData[195]++;
    mouseDown = false;
    _$jscoverage['tools.js'].lineData[196]++;
    drawRect(dispCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
    _$jscoverage['tools.js'].lineData[197]++;
    clearCanvas(drawCtx);
  }
};
  _$jscoverage['tools.js'].lineData[203]++;
  this.changeColor = function(color) {
  _$jscoverage['tools.js'].lineData[204]++;
  drawCtx.strokeStyle = color;
};
};
  _$jscoverage['tools.js'].lineData[209]++;
  tools.circle = function() {
  _$jscoverage['tools.js'].lineData[210]++;
  var tool = this;
  _$jscoverage['tools.js'].lineData[227]++;
  this.mousedown = function(event) {
  _$jscoverage['tools.js'].lineData[228]++;
  if (visit48_228_1(mouseDown)) {
    _$jscoverage['tools.js'].lineData[230]++;
    tool.mouseup(event);
  } else {
    _$jscoverage['tools.js'].lineData[232]++;
    mouseDown = true;
    _$jscoverage['tools.js'].lineData[233]++;
    tool.x0 = event.relx;
    _$jscoverage['tools.js'].lineData[234]++;
    tool.y0 = event.rely;
    _$jscoverage['tools.js'].lineData[235]++;
    drawCtx.beginPath();
  }
};
  _$jscoverage['tools.js'].lineData[239]++;
  this.mousemove = function(event) {
  _$jscoverage['tools.js'].lineData[240]++;
  if (visit49_240_1(!mouseDown)) {
    _$jscoverage['tools.js'].lineData[241]++;
    return;
  }
  _$jscoverage['tools.js'].lineData[244]++;
  midX = (tool.x0 + event.relx) / 2;
  _$jscoverage['tools.js'].lineData[245]++;
  midY = (tool.y0 + event.rely) / 2;
  _$jscoverage['tools.js'].lineData[247]++;
  radius = Math.sqrt(Math.pow(event.relx - midX, 2) + Math.pow(event.rely - midY, 2));
  _$jscoverage['tools.js'].lineData[249]++;
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  _$jscoverage['tools.js'].lineData[251]++;
  if (visit50_251_1(!buggyCircle)) 
    drawCtx.beginPath();
  _$jscoverage['tools.js'].lineData[252]++;
  drawCtx.arc(midX, midY, radius, 0, Math.PI * 2, false);
  _$jscoverage['tools.js'].lineData[253]++;
  drawCtx.stroke();
};
  _$jscoverage['tools.js'].lineData[256]++;
  this.mouseup = function(event) {
  _$jscoverage['tools.js'].lineData[257]++;
  if (visit51_257_1(mouseDown)) {
    _$jscoverage['tools.js'].lineData[258]++;
    tool.mousemove(event);
    _$jscoverage['tools.js'].lineData[259]++;
    mouseDown = false;
    _$jscoverage['tools.js'].lineData[260]++;
    drawCircle(dispCtx, tool.x0, tool.y0, event.relx, event.rely, drawCtx.strokeStyle, drawCtx.lineWidth);
    _$jscoverage['tools.js'].lineData[261]++;
    clearCanvas(drawCtx);
  }
};
  _$jscoverage['tools.js'].lineData[266]++;
  this.changeColor = function(color) {
  _$jscoverage['tools.js'].lineData[267]++;
  drawCtx.strokeStyle = color;
};
};
  _$jscoverage['tools.js'].lineData[272]++;
  tools.clear = function() {
  _$jscoverage['tools.js'].lineData[273]++;
  clearCanvas(dispCtx);
  _$jscoverage['tools.js'].lineData[274]++;
  clearCanvas(drawCtx);
};
  _$jscoverage['tools.js'].lineData[277]++;
  dispCanvas = document.getElementById('myCanvas');
  _$jscoverage['tools.js'].lineData[278]++;
  dispCtx = dispCanvas.getContext("2d");
  _$jscoverage['tools.js'].lineData[279]++;
  clrButton = document.getElementById('clear-button');
  _$jscoverage['tools.js'].lineData[280]++;
  blackButton = document.getElementById('black-button');
  _$jscoverage['tools.js'].lineData[281]++;
  blueButton = document.getElementById('blue-button');
  _$jscoverage['tools.js'].lineData[282]++;
  redButton = document.getElementById('red-button');
  _$jscoverage['tools.js'].lineData[283]++;
  lineThicknessBox = document.getElementById("line-thickness-box");
  _$jscoverage['tools.js'].lineData[285]++;
  colorSelector = document.getElementById("color-selector");
  _$jscoverage['tools.js'].lineData[286]++;
  pencilButton = document.getElementById("pencil-button");
  _$jscoverage['tools.js'].lineData[287]++;
  lineButton = document.getElementById("line-button");
  _$jscoverage['tools.js'].lineData[288]++;
  rectangleButton = document.getElementById("rectangle-button");
  _$jscoverage['tools.js'].lineData[289]++;
  circleButton = document.getElementById("circle-button");
  _$jscoverage['tools.js'].lineData[290]++;
  buggyCircleButton = document.getElementById("buggy-circle-button");
  _$jscoverage['tools.js'].lineData[291]++;
  buggyLineButton = document.getElementById("buggy-line-button");
  _$jscoverage['tools.js'].lineData[292]++;
  debugButton = document.getElementById("debug-button");
  _$jscoverage['tools.js'].lineData[293]++;
  dlPngButton = document.getElementById("download-png-button");
  _$jscoverage['tools.js'].lineData[298]++;
  var cnvsContainer = dispCanvas.parentNode;
  _$jscoverage['tools.js'].lineData[299]++;
  drawCanvas = document.createElement('canvas');
  _$jscoverage['tools.js'].lineData[300]++;
  drawCanvas.id = "drawCanvas";
  _$jscoverage['tools.js'].lineData[301]++;
  drawCanvas.width = dispCanvas.width;
  _$jscoverage['tools.js'].lineData[302]++;
  drawCanvas.height = dispCanvas.height;
  _$jscoverage['tools.js'].lineData[303]++;
  drawCanvas.style.border = "1px solid #FF0000";
  _$jscoverage['tools.js'].lineData[304]++;
  cnvsContainer.appendChild(drawCanvas);
  _$jscoverage['tools.js'].lineData[305]++;
  drawCtx = drawCanvas.getContext('2d');
  _$jscoverage['tools.js'].lineData[306]++;
  drawCtx.lineCap = "round";
  _$jscoverage['tools.js'].lineData[307]++;
  drawCtx.lineJoin = "round";
  _$jscoverage['tools.js'].lineData[309]++;
  drawCanvas.addEventListener('mouseover', handleEvent, false);
  _$jscoverage['tools.js'].lineData[310]++;
  drawCanvas.addEventListener('mouseout', handleEvent, false);
  _$jscoverage['tools.js'].lineData[311]++;
  drawCanvas.addEventListener('mousedown', handleEvent, false);
  _$jscoverage['tools.js'].lineData[312]++;
  drawCanvas.addEventListener('mousemove', handleEvent, false);
  _$jscoverage['tools.js'].lineData[313]++;
  drawCanvas.addEventListener('mouseup', handleEvent, false);
  _$jscoverage['tools.js'].lineData[316]++;
  if (visit52_316_1('MozBoxSizing' in document.documentElement.style)) {
    _$jscoverage['tools.js'].lineData[317]++;
    browser = "firefox";
  } else {
    _$jscoverage['tools.js'].lineData[318]++;
    if (visit53_318_1(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)) {
      _$jscoverage['tools.js'].lineData[319]++;
      browser = "safari";
    } else {
      _$jscoverage['tools.js'].lineData[320]++;
      if (visit54_320_1(!!(visit55_320_2(window.chrome && visit56_320_3(chrome.webstore && chrome.webstore.install))))) {
        _$jscoverage['tools.js'].lineData[321]++;
        browser = "chrome";
      } else {
        _$jscoverage['tools.js'].lineData[322]++;
        if (visit57_322_1('msTransform' in document.documentElement.style)) {
          _$jscoverage['tools.js'].lineData[323]++;
          browser = "ie";
        } else {
          _$jscoverage['tools.js'].lineData[325]++;
          browser = "unknown browser";
        }
      }
    }
  }
  _$jscoverage['tools.js'].lineData[330]++;
  function windowResize() {
    _$jscoverage['tools.js'].lineData[334]++;
    drawCanvas.style.position = "absolute";
    _$jscoverage['tools.js'].lineData[335]++;
    drawCanvas.style.top = "0px";
    _$jscoverage['tools.js'].lineData[336]++;
    drawCanvas.style.left = "0px";
    _$jscoverage['tools.js'].lineData[340]++;
    canvLeft = 0 , canvTop = 0 , temp = dispCanvas;
    _$jscoverage['tools.js'].lineData[341]++;
    if (visit58_341_1(temp.offsetParent)) {
      _$jscoverage['tools.js'].lineData[342]++;
      do {
        _$jscoverage['tools.js'].lineData[343]++;
        canvLeft += temp.offsetLeft;
        _$jscoverage['tools.js'].lineData[344]++;
        canvTop += temp.offsetTop;
      } while (temp = temp.offsetParent);
    }
    _$jscoverage['tools.js'].lineData[350]++;
    drawCanvas.style.left = canvLeft - 8 + "px";
  }
  _$jscoverage['tools.js'].lineData[354]++;
  windowResize();
  _$jscoverage['tools.js'].lineData[357]++;
  tool = new tools[currentTool]();
  _$jscoverage['tools.js'].lineData[362]++;
  function canvasUpdate() {
    _$jscoverage['tools.js'].lineData[363]++;
    dispCtx.drawImage(drawCanvas, 0, 0);
    _$jscoverage['tools.js'].lineData[364]++;
    clearCanvas(drawCtx);
  }
  _$jscoverage['tools.js'].lineData[367]++;
  function clear() {
    _$jscoverage['tools.js'].lineData[368]++;
    clearCanvas(dispCtx);
    _$jscoverage['tools.js'].lineData[369]++;
    clearCanvas(drawCtx);
  }
  _$jscoverage['tools.js'].lineData[372]++;
  function handleEvent(event) {
    _$jscoverage['tools.js'].lineData[376]++;
    if (visit59_376_1(visit60_376_2(browser == "chrome") || visit61_376_3(browser == "safari"))) {
      _$jscoverage['tools.js'].lineData[389]++;
      event.relx = event.offsetX;
      _$jscoverage['tools.js'].lineData[390]++;
      event.rely = event.offsetY;
    } else {
      _$jscoverage['tools.js'].lineData[392]++;
      if (visit62_392_1(browser = visit63_392_2("firefox" || visit64_392_3(browser == "ie")))) {
        _$jscoverage['tools.js'].lineData[394]++;
        event.relx = event.layerX;
        _$jscoverage['tools.js'].lineData[395]++;
        event.rely = event.layerY;
      }
    }
    _$jscoverage['tools.js'].lineData[398]++;
    var funcToCall = tool[event.type];
    _$jscoverage['tools.js'].lineData[399]++;
    if (visit65_399_1(funcToCall)) {
      _$jscoverage['tools.js'].lineData[401]++;
      funcToCall(event);
    } else {
      _$jscoverage['tools.js'].lineData[403]++;
      if (visit66_403_1(debug)) 
        console.log(currentTool + " has no associated function " + event.type);
    }
  }
  _$jscoverage['tools.js'].lineData[407]++;
  window.onresize = function() {
  _$jscoverage['tools.js'].lineData[408]++;
  if (visit67_408_1(debug)) 
    console.log("canvas is resizing");
  _$jscoverage['tools.js'].lineData[409]++;
  windowResize();
};
  _$jscoverage['tools.js'].lineData[412]++;
  clrButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[413]++;
  clear();
  _$jscoverage['tools.js'].lineData[416]++;
  updateModule.sendAction("clear", 0, 0, 0, 0, 0, 0);
  _$jscoverage['tools.js'].lineData[418]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[422]++;
  pencilButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[423]++;
  currentTool = "pencil";
  _$jscoverage['tools.js'].lineData[424]++;
  tool = new tools[currentTool]();
  _$jscoverage['tools.js'].lineData[425]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[428]++;
  lineButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[429]++;
  console.log("here");
  _$jscoverage['tools.js'].lineData[430]++;
  buggyLine = false;
  _$jscoverage['tools.js'].lineData[431]++;
  currentTool = "line";
  _$jscoverage['tools.js'].lineData[432]++;
  tool = new tools[currentTool]();
  _$jscoverage['tools.js'].lineData[433]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[436]++;
  rectangleButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[437]++;
  currentTool = "rectangle";
  _$jscoverage['tools.js'].lineData[438]++;
  tool = new tools[currentTool]();
  _$jscoverage['tools.js'].lineData[439]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[442]++;
  circleButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[443]++;
  buggyCircle = false;
  _$jscoverage['tools.js'].lineData[444]++;
  currentTool = "circle";
  _$jscoverage['tools.js'].lineData[445]++;
  tool = new tools[currentTool]();
  _$jscoverage['tools.js'].lineData[446]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[449]++;
  buggyLineButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[451]++;
  drawCtx.beginPath();
  _$jscoverage['tools.js'].lineData[452]++;
  buggyLine = true;
  _$jscoverage['tools.js'].lineData[453]++;
  currentTool = "line";
  _$jscoverage['tools.js'].lineData[454]++;
  tool = new tools[currentTool]();
  _$jscoverage['tools.js'].lineData[455]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[458]++;
  buggyCircleButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[460]++;
  drawCtx.beginPath();
  _$jscoverage['tools.js'].lineData[461]++;
  buggyCircle = true;
  _$jscoverage['tools.js'].lineData[462]++;
  currentTool = "circle";
  _$jscoverage['tools.js'].lineData[463]++;
  tool = new tools[currentTool]();
  _$jscoverage['tools.js'].lineData[464]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[467]++;
  blackButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[468]++;
  tool.changeColor('#000000');
  _$jscoverage['tools.js'].lineData[469]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[472]++;
  blueButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[473]++;
  tool.changeColor('#0000FF');
  _$jscoverage['tools.js'].lineData[474]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[477]++;
  redButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[478]++;
  tool.changeColor('#FF0000');
  _$jscoverage['tools.js'].lineData[479]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[491]++;
  colorSelector.onchange = function(event) {
  _$jscoverage['tools.js'].lineData[492]++;
  console.log("in here" + colorSelector.value);
  _$jscoverage['tools.js'].lineData[493]++;
  tool.changeColor(colorSelector.value);
};
  _$jscoverage['tools.js'].lineData[498]++;
  lineThicknessBox.onkeydown = function(event) {
  _$jscoverage['tools.js'].lineData[499]++;
  if (visit68_499_1(event.keyCode == 13)) {
    _$jscoverage['tools.js'].lineData[500]++;
    drawCtx.lineWidth = parseInt(lineThicknessBox.value);
    _$jscoverage['tools.js'].lineData[501]++;
    lineThicknessBox.value = "Line Thickness";
    _$jscoverage['tools.js'].lineData[502]++;
    return false;
  }
};
  _$jscoverage['tools.js'].lineData[507]++;
  console.log(dlPngButton);
  _$jscoverage['tools.js'].lineData[508]++;
  dlPngButton.onclick = function(event) {
  _$jscoverage['tools.js'].lineData[509]++;
  Canvas2Image.saveAsPNG(dispCanvas);
  _$jscoverage['tools.js'].lineData[510]++;
  document.getElementById('canvas-message2').innerHTML = "Thanks for download the image, plese rename file to <filename>.png to view";
  _$jscoverage['tools.js'].lineData[511]++;
  return false;
};
  _$jscoverage['tools.js'].lineData[514]++;
  debugButton.onclick = function() {
  _$jscoverage['tools.js'].lineData[515]++;
  debug = !debug;
  _$jscoverage['tools.js'].lineData[516]++;
  if (visit69_516_1(debug)) {
    _$jscoverage['tools.js'].lineData[517]++;
    debugButton.value = "Debug On (look at console)";
    _$jscoverage['tools.js'].lineData[518]++;
    console.log("browser is: " + browser);
    _$jscoverage['tools.js'].lineData[519]++;
    if (visit70_519_1(canvTop)) 
      console.log("canvTop: " + canvTop + " canvLeft: " + canvLeft);
  } else {
    _$jscoverage['tools.js'].lineData[521]++;
    debugButton.value = "Debug Off";
  }
  _$jscoverage['tools.js'].lineData[523]++;
  return false;
};
}
