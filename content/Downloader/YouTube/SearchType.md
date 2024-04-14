## .YouTube.search(text, {searchType: type});

YouTube Search by searchType.

```js
FongsiDev_Scraper.YouTube.search("NCS", {
  searchType: "channel",
}).then(console.log);

FongsiDev_Scraper.YouTube.search("NCS", {
  searchType: "live",
}).then(console.log);

FongsiDev_Scraper.YouTube.search("NCS", {
  searchType: "playlist",
}).then(console.log);
```

| PARAMETER | TYPE   | DESCRIPTION         |
| --------- | ------ | ------------------- |
| text       | string | Text to search for videos on YouTube |
| type       | string | Filter your search according to your type of believer |

Scope: `ASYNC`

Returns: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a><Object>
