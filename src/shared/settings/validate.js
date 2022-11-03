"use strict";module.exports = validate20;module.exports.default = validate20;const schema22 = {"type":"object","properties":{"keymaps":{"type":"object","patternProperties":{".*":{"type":"object","properties":{"type":{"type":"string"}},"required":["type"]}}},"search":{"type":"object","properties":{"default":{"type":"string"},"engines":{"type":"object","patternProperties":{".*":{"type":"string"}}}},"required":["default","engines"]},"properties":{"type":"object","patternProperties":{".*":{"anyOf":[{"type":"string"},{"type":"number"},{"type":"boolean"}]}}},"blacklist":{"type":"array","items":{"anyOf":[{"type":"string"},{"type":"object","properties":{"url":{"type":"string"},"keys":{"type":"array","items":{"type":"string"}}},"required":["url","keys"]}]}}},"additionalProperties":false};const pattern0 = new RegExp(".*", "u");function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){const _errs1 = errors;for(const key0 in data){if(!((((key0 === "keymaps") || (key0 === "search")) || (key0 === "properties")) || (key0 === "blacklist"))){validate20.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.keymaps !== undefined){let data0 = data.keymaps;const _errs2 = errors;if(errors === _errs2){if(data0 && typeof data0 == "object" && !Array.isArray(data0)){var valid1 = true;for(const key1 in data0){if(pattern0.test(key1)){let data1 = data0[key1];const _errs4 = errors;if(errors === _errs4){if(data1 && typeof data1 == "object" && !Array.isArray(data1)){let missing0;if((data1.type === undefined) && (missing0 = "type")){validate20.errors = [{instancePath:instancePath+"/keymaps/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/keymaps/patternProperties/.*/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data1.type !== undefined){if(typeof data1.type !== "string"){validate20.errors = [{instancePath:instancePath+"/keymaps/" + key1.replace(/~/g, "~0").replace(/\//g, "~1")+"/type",schemaPath:"#/properties/keymaps/patternProperties/.*/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate20.errors = [{instancePath:instancePath+"/keymaps/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/keymaps/patternProperties/.*/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs4 === errors;if(!valid1){break;}}}}else {validate20.errors = [{instancePath:instancePath+"/keymaps",schemaPath:"#/properties/keymaps/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.search !== undefined){let data3 = data.search;const _errs8 = errors;if(errors === _errs8){if(data3 && typeof data3 == "object" && !Array.isArray(data3)){let missing1;if(((data3.default === undefined) && (missing1 = "default")) || ((data3.engines === undefined) && (missing1 = "engines"))){validate20.errors = [{instancePath:instancePath+"/search",schemaPath:"#/properties/search/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data3.default !== undefined){const _errs10 = errors;if(typeof data3.default !== "string"){validate20.errors = [{instancePath:instancePath+"/search/default",schemaPath:"#/properties/search/properties/default/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs10 === errors;}else {var valid3 = true;}if(valid3){if(data3.engines !== undefined){let data5 = data3.engines;const _errs12 = errors;if(errors === _errs12){if(data5 && typeof data5 == "object" && !Array.isArray(data5)){var valid4 = true;for(const key2 in data5){if(pattern0.test(key2)){const _errs14 = errors;if(typeof data5[key2] !== "string"){validate20.errors = [{instancePath:instancePath+"/search/engines/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/search/properties/engines/patternProperties/.*/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs14 === errors;if(!valid4){break;}}}}else {validate20.errors = [{instancePath:instancePath+"/search/engines",schemaPath:"#/properties/search/properties/engines/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs12 === errors;}else {var valid3 = true;}}}}else {validate20.errors = [{instancePath:instancePath+"/search",schemaPath:"#/properties/search/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid0 = _errs8 === errors;}else {var valid0 = true;}if(valid0){if(data.properties !== undefined){let data7 = data.properties;const _errs16 = errors;if(errors === _errs16){if(data7 && typeof data7 == "object" && !Array.isArray(data7)){var valid5 = true;for(const key3 in data7){if(pattern0.test(key3)){let data8 = data7[key3];const _errs18 = errors;const _errs19 = errors;let valid6 = false;const _errs20 = errors;if(typeof data8 !== "string"){const err0 = {instancePath:instancePath+"/properties/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/properties/patternProperties/.*/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}var _valid0 = _errs20 === errors;valid6 = valid6 || _valid0;if(!valid6){const _errs22 = errors;if(!((typeof data8 == "number") && (isFinite(data8)))){const err1 = {instancePath:instancePath+"/properties/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/properties/patternProperties/.*/anyOf/1/type",keyword:"type",params:{type: "number"},message:"must be number"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}var _valid0 = _errs22 === errors;valid6 = valid6 || _valid0;if(!valid6){const _errs24 = errors;if(typeof data8 !== "boolean"){const err2 = {instancePath:instancePath+"/properties/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/properties/patternProperties/.*/anyOf/2/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}var _valid0 = _errs24 === errors;valid6 = valid6 || _valid0;}}if(!valid6){const err3 = {instancePath:instancePath+"/properties/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/properties/patternProperties/.*/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;validate20.errors = vErrors;return false;}else {errors = _errs19;if(vErrors !== null){if(_errs19){vErrors.length = _errs19;}else {vErrors = null;}}}var valid5 = _errs18 === errors;if(!valid5){break;}}}}else {validate20.errors = [{instancePath:instancePath+"/properties",schemaPath:"#/properties/properties/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid0 = _errs16 === errors;}else {var valid0 = true;}if(valid0){if(data.blacklist !== undefined){let data9 = data.blacklist;const _errs26 = errors;if(errors === _errs26){if(Array.isArray(data9)){var valid7 = true;const len0 = data9.length;for(let i0=0; i0<len0; i0++){let data10 = data9[i0];const _errs28 = errors;const _errs29 = errors;let valid8 = false;const _errs30 = errors;if(typeof data10 !== "string"){const err4 = {instancePath:instancePath+"/blacklist/" + i0,schemaPath:"#/properties/blacklist/items/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}var _valid1 = _errs30 === errors;valid8 = valid8 || _valid1;if(!valid8){const _errs32 = errors;if(errors === _errs32){if(data10 && typeof data10 == "object" && !Array.isArray(data10)){let missing2;if(((data10.url === undefined) && (missing2 = "url")) || ((data10.keys === undefined) && (missing2 = "keys"))){const err5 = {instancePath:instancePath+"/blacklist/" + i0,schemaPath:"#/properties/blacklist/items/anyOf/1/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}else {if(data10.url !== undefined){const _errs34 = errors;if(typeof data10.url !== "string"){const err6 = {instancePath:instancePath+"/blacklist/" + i0+"/url",schemaPath:"#/properties/blacklist/items/anyOf/1/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}var valid9 = _errs34 === errors;}else {var valid9 = true;}if(valid9){if(data10.keys !== undefined){let data12 = data10.keys;const _errs36 = errors;if(errors === _errs36){if(Array.isArray(data12)){var valid10 = true;const len1 = data12.length;for(let i1=0; i1<len1; i1++){const _errs38 = errors;if(typeof data12[i1] !== "string"){const err7 = {instancePath:instancePath+"/blacklist/" + i0+"/keys/" + i1,schemaPath:"#/properties/blacklist/items/anyOf/1/properties/keys/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}var valid10 = _errs38 === errors;if(!valid10){break;}}}else {const err8 = {instancePath:instancePath+"/blacklist/" + i0+"/keys",schemaPath:"#/properties/blacklist/items/anyOf/1/properties/keys/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}}var valid9 = _errs36 === errors;}else {var valid9 = true;}}}}else {const err9 = {instancePath:instancePath+"/blacklist/" + i0,schemaPath:"#/properties/blacklist/items/anyOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}}var _valid1 = _errs32 === errors;valid8 = valid8 || _valid1;}if(!valid8){const err10 = {instancePath:instancePath+"/blacklist/" + i0,schemaPath:"#/properties/blacklist/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;validate20.errors = vErrors;return false;}else {errors = _errs29;if(vErrors !== null){if(_errs29){vErrors.length = _errs29;}else {vErrors = null;}}}var valid7 = _errs28 === errors;if(!valid7){break;}}}else {validate20.errors = [{instancePath:instancePath+"/blacklist",schemaPath:"#/properties/blacklist/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs26 === errors;}else {var valid0 = true;}}}}}}else {validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate20.errors = vErrors;return errors === 0;}