'use strict';
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var store = require('../storage/store.js');
var config = require('../configuration/config.js').getConfig();

let startUrl;
let pagesVisited = [];
let numPagesVisited = 0;
let pagesToVisit = [];
let url;
let rIgnores;

let obj = {};
module.exports = obj;

/**
 * Crawler start function
 * @param {*} crawlingStartUrl - url for crawling begginging.
 */
obj.start = function(){
    startUrl = config.startUrl;
    url = new URL(startUrl);
    pagesToVisit.push(startUrl);
    crawl();
}

/**
 * recursive crawl function
 */
function crawl() {
    let nextPage = pagesToVisit.pop();
    if (typeof nextPage === "undefined" || numPagesVisited === config.maxVisits) {
        //async call without await.
        store.storeToFile();
        console.log("End crawling. Visited %s pages", numPagesVisited);
    } else if (pagesVisited.includes(nextPage)) {
        // Page have been visited. Continue.
        crawl();
    } else {
        // Process new page
        visitPage(nextPage, crawl);
    }
}

/**
 * Visiting page and gathering data.
 * Using Callbacks. It might be wrapped with Promise for async/await usage.
 * @param {*} url - current url
 * @param {*} callback - what to after processing. Basically it should crawl further.
 */
function visitPage(url, callback) {
    // Add page to our set
    pagesVisited.push(url);
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
        if (response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        // Callback is crawl()
        let $ = cheerio.load(body);
        collectLinks(url, $);
        collectRelativeLinks(url, $);
        callback();

    });
}

/**
 * Extract absolute links from response body
 * @param {*} parentUrl - url of parent site
 * @param {*} $ - document body
 */
function collectLinks(parentUrl, $) {
    let collectedLinks = $("a[href^='http']");
    console.log("Found " + collectedLinks.length + " links on page");
    collectedLinks.each(function () {
        let link = $(this).attr('href');
        //add to outside links based on parentUrl
        if (!(link.indexOf(startUrl) > -1)) {
            store.addOutsideLink(parentUrl, link)
            return;
        }
        //add to inside links based on parentUrl
        if (!ignore(link)) {
            store.addAbsoluteSiteLink(parentUrl, link)
            pagesToVisit.push(link);
        }
    });
}

/**
 * Extract relative links from response body
 * @param {*} parentUrl - url of parent site
 * @param {*} $ - document body
 */
function collectRelativeLinks(parentUrl, $) {
    let relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links");
    relativeLinks.each(function () {
        let link = $(this).attr('href');
        store.addRelativeSiteLink(parentUrl, link)
    });
}

/**
 * Ignore function (anchors and queries as well as tags) . Should be moved to utils class. 
 * @param {*} link - url
 */
function ignore(link){
    if (typeof rIgnores === "undefined"){ 
        rIgnores = new RegExp(config.ignores.join('|'), 'i');
    }
    return link.match(rIgnores)
}