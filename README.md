# web-crawler
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
It could use some configuration file for pointing target and ignores. Other possible improvements are noted in code comments.

