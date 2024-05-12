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

//Paste it into your console on the karlo.ai website to get the token;

(function () {
  var cookie = (key) =>
    (new RegExp((key || "=") + "=(.*?); ", "gm").exec(
      document.cookie + "; ",
    ) || ["", null])[1];
  if (cookie("authToken") !== null) {
    console.log("%cWorked!", "font-size: 50px");
    console.log(
      `%cYou now have your token in the clipboard!`,
      "font-size: 16px",
    );
    return copy(cookie("authToken"));
  }
  if (cookie("karlo-image-auth-token") !== null) {
    console.log("%cWorked!", "font-size: 50px");
    console.log(
      `%cYou now have your token in the clipboard!`,
      "font-size: 16px",
    );
    return copy(cookie("karlo-image-auth-token"));
  }
  console.log("%cFail!", "font-size: 50px");
})();
```

| PARAMETER | TYPE   | DESCRIPTION                              |
| --------- | ------ | ---------------------------------------- |
| token     | string | This token is from the website's Cookies |

Scope: `ASYNC`

Returns: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a><Object>
