const fetch = require("node-fetch");

class ToolTranslator {
  constructor(text, langTo) {
    this.langTo = langTo || "en";
    this.text = text;
    this.response = null;
    if (!this.isLanguageSupported(langTo)) {
      throw new Error("Unsupported language");
    }
  }
  isLanguageSupported(lang) {
    const supportedLanguages = [
      "ar",
      "ur",
      "en",
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
    return supportedLanguages.includes(lang);
  }
  translate() {
    return new Promise((resolve, reject) => {
      try {
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${this.langTo}&ie=UTF-8&dt=t&q=${encodeURIComponent(this.text)}`;
        fetch(url, {
          method: "GET",
          headers: {
            Host: "translate.google.com",
            "User-Agent":
              "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:56.0) Gecko/20100101 Firefox/56.0",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            let translatedText = "";
            data[0].forEach((item) => {
              translatedText += item[0];
            });
            this.response = translatedText;
            if (this.response.trim().length > 1) {
              resolve(this.response);
            } else {
              reject("Invalid Input");
            }
          })
          .catch((error) => {
            reject("Network Error: " + error?.message ? error.message : error);
          });
      } catch (error) {
        reject("Error: " + error?.message ? error.message : error);
      }
    });
  }
}

module.exports = ToolTranslator;
