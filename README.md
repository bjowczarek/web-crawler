# web-crawler
Useful for scrapping pages that do not use relative links extensively. This type is only counted but not used to iterate.

## config
Use `configuration/config.json` for setting crawler bahaviour.
* `"startUrl"` - start URL ex. `https://example.com`
* `"ignores"` - URL ignores ex: `["#", "\\?", "tag"]` (anchors, queries, tags),
* `"maxVisits"` - maximum number of sites to visit. `-1` means unlimited. ,
* `"countingMode"` - if `true` store counted number of links in result.json file.
 
## running 
* modify START_URL in crawler.js and run
```
npm install
npm test
npm start
```
## results
Results are stored in `result.json` file. For each page links are groupped in 3 categories:
* `relativeLinks` - relative links inside domain.
* `absoluteLinks`- absolute links inside domain.
* `outsideLinks` - links pointing to results outisde domain 
Solution currently is not supporting looking for static resources (ex. jpg).
Possible improvements are noted in code comments.

