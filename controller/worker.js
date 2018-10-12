'use strict';
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

let START_URL = "https://wiprodigital.com";
let pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [];
let allAbsoluteLinks = [];
let url = new URL(START_URL);
let baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);

let obj = {};
module.exports = obj;

obj.start = function(startUrl){
    START_URL = startUrl;
    crawl();
}


function crawl() {
    let nextPage = pagesToVisit.pop();
    if (typeof nextPage === "undefined") {
        console.log("End crawling");
    } else if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
    } else {
        // New page we haven't visited
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        if (response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        let $ = cheerio.load(body);
        collectInternalLinks($);
        // In this short program, our callback is just calling crawl()
        callback();

    });
}

function collectInternalLinks($) {
    let relativeLinks = $("a[href^='https://wiprodigital.com']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function () {
        let relativeLink = $(this).attr('href').replace(START_URL, "");
        console.log(relativeLink);
        pagesToVisit.push(baseUrl + relativeLink);
    });
}

function collectExternalLinks($) {
    let absoluteLinks = $("a[href^='http']");
    console.log("Found " + allAbsoluteLinks.length + " absolute links");
    absoluteLinks.each(function () {
        allAbsoluteLinks.push($(this).attr('href'));
    });
}