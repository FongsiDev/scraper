## .GoogleLens(image isShort = true >default<);

Google Lens.

```js
function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

//This is the URL version
FongsiDev_Scraper.GoogleLens(
  "https://telegra.ph/file/f0ff2f9f373c962d8e2e5.jpg",
).then(console.log);

//This is the Buffer File version
readFile("./tmp/4420937.png").then((data) => {
  console.log("Isi file:", data);
  FongsiDev_Scraper.GoogleLens(data).then(console.log);
});
```

| PARAMETER | TYPE    | DESCRIPTION                      |
| --------- | ------- | -------------------------------- |
| image     | string  | Link/ImagePath                   |
| isShort   | boolean | For Shorten URL from Google Lens |

Scope: `ASYNC`

Returns: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a><Object>
