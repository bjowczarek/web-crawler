'use strict';
var fs = require('fs');
var path = require('path');
var config = require('../configuration/config.js').getConfig();


let siteMap = {};
let INIT_PAGE_PARAMS = {
    relativeLinks: [],
    absoluteLinks: [],
    outsideLinks: [],
    imageLinks: []
}


let obj = {};
module.exports = obj;

/**
 * add new link to site map. Creates "flat" site structure. Sub-sub-pages are not nested in root.
 * @param {*} parent parent url
 * @param {*} link child url
 */
obj.addRelativeSiteLink = function (parent, link){
    if (!siteMap.hasOwnProperty(parent)){
        siteMap[parent] = INIT_PAGE_PARAMS;
    }
    siteMap[parent].relativeLinks.push(link);
    return siteMap;
}
/**
 * add new link to site map. Creates "flat" site structure. Sub-sub-pages are not nested in root.
 * @param {*} parent parent url
 * @param {*} link child url
 */
obj.addAbsoluteSiteLink = function (parent, link) {
    if (!siteMap.hasOwnProperty(parent)) {
        siteMap[parent] = INIT_PAGE_PARAMS;
    }
    siteMap[parent].absoluteLinks.push(link);
    return siteMap;
}
/**
 * add new link to site map. Creates "flat" site structure. Sub-sub-pages are not nested in root.
 * @param {*} parent parent url
 * @param {*} link child url
 */
obj.addOutsideLink = function (parent, link) {
    if (!siteMap.hasOwnProperty(parent)) {
        siteMap[parent] = INIT_PAGE_PARAMS;
    }
    siteMap[parent].outsideLinks.push(link);
    return siteMap;
}
/**
 * add new link to image. Creates "flat" site structure. Sub-sub-pages are not nested in root.
 * @param {*} parent parent url
 * @param {*} link child url
 */
obj.addImageLink = function (parent, link) {
    if (!siteMap.hasOwnProperty(parent)) {
        siteMap[parent] = INIT_PAGE_PARAMS;
    }
    siteMap[parent].imageLinks.push(link);
    return siteMap;
}
/**
 * Write siteMap to file
 */
obj.storeToFile = async function () {
    if (config.countingMode){
        siteMap = calcMap();
    }
    let str = JSON.stringify(siteMap);
    let status = await writeFileAsPromise(str, path.resolve(__dirname, "../result.json"))
    return status;
}

function calcMap() {
    let newMap = {};
    for (let key in siteMap) {
        newMap[key] = {
            relativeLinks: siteMap[key].relativeLinks.length,
            absoluteLinks: siteMap[key].absoluteLinks.length,
            outsideLinks: siteMap[key].outsideLinks.length,
            imageLinks: siteMap[key].imageLinks.length
        }
    }
    return newMap;
}

/**
 * wrapper function for file writting.
 * @param {*} str txt to write
 * @param {*} file file to store
 */
function writeFileAsPromise(str, file) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, str, 'utf8', function (err) {
            if (err) {
                console.log("Error saving data: %s", JSON.stringify(err));
                reject("Error saving data: %s", JSON.stringify(err));
            } else {
                resolve("Success");
            }
        });
    });
}