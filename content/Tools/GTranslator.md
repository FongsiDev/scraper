## .Translator(text lang = "en" >default<);

Google Translator.

```js
new FongsiDev_Scraper.Translator("Hello World", "id")
  .translate()
  .then(console.log);

//supported Languages
const supportedLanguages = [
  "ar",
  "ur",
  "en", //Default
  "fr",
  "de",
  "id",
  "gu",
  "hi",
  "it",
  "ja",
  "kn",
  "ta",
  "te",
  "bn",
  "ml",
  "mr",
  "ne",
  "pa",
  "es",
  "ru",
  "pt",
  "tr",
  "vi",
];
```

| PARAMETER | TYPE   | DESCRIPTION                                    |
| --------- | ------ | ---------------------------------------------- |
| text      | string | For text that will be a change from lang       |
| lang      | string | To change the text to the appropriate language |

Scope: `ASYNC`

Returns: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a><Object>
