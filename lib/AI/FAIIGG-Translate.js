const axios = require("axios");
const FormData = require("form-data");

class AI_FAIIGG_Translate {
  constructor(cookies) {
    this.cookies = cookies;
    if (!this.cookies)
      return global.throwFSPR(
        "You don't install cookies on the www.freeaiimagegenerator.org website, take the _qurn part for this program to run smoothly :)",
      );
  }

  getLanguageNumber(lang) {
    const LANGUAGES = {
      ar: "Arabic",
      zh: "Chinese",
      da: "Danish",
      nl: "Dutch",
      en: "English",
      fr: "French",
      de: "German",
      he: "Hebrew",
      hi: "Hindi",
      id: "Indonesian",
      it: "Italian",
      ja: "Japanese",
      pl: "Polish",
      ro: "Romanian",
      ru: "Russian",
      es: "Spanish",
      sv: "Swedish",
      tr: "Turkish",
      vi: "Vietnamese",
    };
    const LANGUAGES_1 = {
      0: "Arabic",
      1: "Chinese",
      2: "Danish",
      3: "Dutch",
      4: "English",
      5: "French",
      6: "German",
      7: "Hebrew",
      8: "Hindi",
      9: "Indonesian",
      10: "Italian",
      11: "Japanese",
      12: "Polish",
      13: "Romanian",
      14: "Russian",
      15: "Spanish",
      16: "Swedish",
      17: "Turkish",
      18: "Vietnamese",
    };

    const langCode = LANGUAGES.hasOwnProperty(lang)
      ? lang
      : Object.keys(LANGUAGES).find((key) => LANGUAGES[key] === lang);

    return Object.keys(LANGUAGES_1).find(
      (key) => LANGUAGES_1[key] === LANGUAGES[langCode],
    );
  }

  async translate(
    text,
    lang = "en",
    quality = "0.75",
    tone = "professional",
    max_results = 200,
  ) {
    try {
      lang = lang || this.getLanguageNumber("en");
      if (!lang)
        return {
          status: 404,
          msg: `Language not supported: ${lang}`,
        };
      lang = this.getLanguageNumber(lang.toLowerCase());

      const form = new FormData();
      form.append("description", text);
      form.append("language", lang);
      form.append("quality", quality);
      form.append("tone", tone);
      form.append("no_of_results", "1");
      form.append("max_results", max_results);
      form.append("ai_template", "translate");

      const response = await axios.post(
        "https://www.freeaiimagegenerator.org/php/d8ea1nk2e9.php",
        form,
        {
          params: {
            action: "generate_content",
          },
          headers: {
            ...form.getHeaders(),
            authority: "www.freeaiimagegenerator.org",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
            cookie: this.cookies,
            origin: "https://www.freeaiimagegenerator.org",
            referer:
              "https://www.freeaiimagegenerator.org/ai-templates/translate",
            "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
          },
        },
      );

      return global.resolveFSPR(response.data);
    } catch (error) {
      return global.rejectFSPR(error);
    }
  }
}

module.exports = AI_FAIIGG_Translate;
