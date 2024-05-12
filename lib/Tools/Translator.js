const fetch = require("node-fetch");
const headers = require("../../utils/header.js");

class ToolTranslator {
  constructor(text, langTo) {
    this.langTo = langTo || "en";
    this.text = text;
    this.response = null;
    if (!this.isLanguageSupported(langTo)) {
      return global.throwFSPR("Unsupported language");
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
            ...headers(),
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
            reject(global.rejectFSPR(error));
          });
      } catch (error) {
        reject(global.rejectFSPR(error));
      }
    });
  }
}

module.exports = ToolTranslator;
