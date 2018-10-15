'use strict';
var fs = require('fs');
var path = require('path')

let siteMap = {};
let INIT_PAGE_PARAMS = {
    relativeLinks: [],
    absoluteLinks: [],
    outsideLinks: []
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
 * Write siteMap to file
 */
obj.storeToFile = async function () {
    let str = JSON.stringify(siteMap);
    let status = await writeFileAsPromise(str, path.resolve(__dirname, "../result.json"))
    return status;
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