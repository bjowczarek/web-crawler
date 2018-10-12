var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "https://wiprodigital.com";
var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var allAbsoluteLinks = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
    var nextPage = pagesToVisit.pop();
    if (typeof nextPage === "undefined") {
        console.log("End crawling");
    }
    else if (nextPage in pagesVisited) {
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
        console.log("Status code: " + response.statusCode);
        if (response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        collectInternalLinks($);
        // In this short program, our callback is just calling crawl()
        callback();
        
    });
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='https://wiprodigital.com']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        let relativeLink = $(this).attr('href').replace(START_URL, "");
        console.log(relativeLink);
        pagesToVisit.push(baseUrl + relativeLink);
    });
}

function collectExternalLinks($) {
    var absoluteLinks = $("a[href^='http']");
    console.log("Found " + allAbsoluteLinks.length + " absolute links");
    absoluteLinks.each(function () {
        allAbsoluteLinks.push($(this).attr('href'));
    });
}