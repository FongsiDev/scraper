## .DiscordCloud(file);

Discord Upload.

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
const B = new FongsiDev_Scraper.DiscordCloud({
  webhooks: [...],
  token: ""
  channelId: ""
});

readFile("./tmp/4420937.png").then((data) => {
  console.log("Isi file:", data);
  B.upload(data, "4420937.png").then((x) => {
  console.log(x);
  B.toFile(x).then((x1) => {
      fs.writeFile("./tmp/s.zip", x1, (err) => {
        if (err) throw err;
        console.log("Data telah disimpan dalam file.");
      });
    });
  });
});
```

| PARAMETER | TYPE | DESCRIPTION |
| --------- | ---- | ----------- |
| file      | ?    | File        |

Scope: `ASYNC`

Returns: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a><Object>
