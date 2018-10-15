'use strict';
var expect = require("chai").expect;
var store = require("../storage/store.js");

describe("Storage module", function () {
    describe("Collect relative link", function () {
        it("collects relative links", function () {
            let parent = "https://example.com";
            let map = store.addRelativeSiteLink(parent, "/site1/subpage1");
            expect(map[parent].relativeLinks).deep.equal(["/site1/subpage1"]);
            let map2 = store.addRelativeSiteLink(parent, "/site2");
            expect(map2[parent].relativeLinks).deep.equal(["/site1/subpage1", "/site2"]);
            expect(map).deep.equal(map2);
        });
    });

    describe("Collect absolute link", function () {
        it("collects absolute links", function () {
            let parent = "https://example.com";
            let map = store.addAbsoluteSiteLink("https://example.com", "https://example.com/site1/subpage1");
            expect(map[parent].absoluteLinks).deep.equal(["https://example.com/site1/subpage1"]);
            let map2 = store.addAbsoluteSiteLink("https://example.com", "https://example.com/site2");
            expect(map2[parent].absoluteLinks).deep.equal(["https://example.com/site1/subpage1", "https://example.com/site2"]);
            expect(map).deep.equal(map2);

            });
    });

    describe("Collect outside link", function () {
        it("collects outside links", function () {
            let parent = "https://example.com";
            let map = store.addOutsideLink("https://example.com", "https://outside.com/site1/subpage1")
            expect(map[parent].outsideLinks).deep.equal(["https://outside.com/site1/subpage1"]);
            let map2 = store.addOutsideLink("https://example.com", "https://outside.com/site2") 
            expect(map2[parent].outsideLinks).deep.equal(["https://outside.com/site1/subpage1", "https://outside.com/site2"]);
            expect(map).deep.equal(map2);
        });
    });

    describe("Save file", function () {
        it("saves a file.", async function() {
            await store.storeToFile();
            let exists = require('fs').existsSync("result.json");
            expect(exists).to.equal(true);
        });
    });
});