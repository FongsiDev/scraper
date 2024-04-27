## new .KarloAI(token);

Karlo AI Web: https://karlo.ai.

```js
const karloAI = new FongsiDev_Scraper.KarloAI("YOUR_TOKEN_HERE");

karloAI
  .generateImage({
    prompt: "<YOUR_PROMPT>",
    negativePrompt: "<YOUR_NEGATIGE_PROMPT>",
  })
  .then((data) => {
    console.log("Generated image data:", data);
  })
  .catch((error) => {
    console.error("Error generating image:", error);
  });
```

| PARAMETER | TYPE   | DESCRIPTION                              |
| --------- | ------ | ---------------------------------------- |
| token     | string | This token is from the website's Cookies |

Scope: `ASYNC`

Returns: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a><Object>
