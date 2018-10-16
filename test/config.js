'use strict';
var expect = require("chai").expect;
var config = require("../configuration/config.js");

describe("Config module", function () {
    describe("Return configuration object", function () {
        it("returns configuration object", function () {
            let cfgObj = config.getConfig();
            let result = true;
            if (typeof cfgObj === "undefined")
                result = false;
            if (typeof cfgObj.startUrl === "undefined")
                result = false;
            if (typeof cfgObj.ignores === "undefined")
                result = false;
            if (typeof cfgObj.maxVisits === "undefined")
                result = false;
            if (typeof cfgObj.countingMode === "undefined")
                result = false;
            expect(result).to.equal(true);
        });
    });
});