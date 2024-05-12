const https = require("https");

const LANGUAGES = {
  af: "Afrikaans",
  sq: "Albanian",
  ar: "Arabic",
  hy: "Armenian",
  ca: "Catalan",
  zh: "Chinese",
  "zh-CN": "Chinese (Mandarin/China)",
  "zh-TW": "Chinese (Mandarin/Taiwan)",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  fi: "Finnish",
  fr: "French",
  de: "German",
  el: "Greek",
  ht: "Haitian Creole",
  hi: "Hindi",
  hu: "Hungarian",
  is: "Icelandic",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  la: "Latin",
  lv: "Latvian",
  mk: "Macedonian",
  no: "Norwegian",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  sr: "Serbian",
  sk: "Slovak",
  es: "Spanish",
  sw: "Swahili",
  sv: "Swedish",
  ta: "Tamil",
  th: "Thai",
  tr: "Turkish",
  vi: "Vietnamese",
  cy: "Welsh",
};

const ToolGtts = (text, lang, slow) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      hostname: "translate.google.com",
      method: "POST",
      path: "/_/TranslateWebserverUi/data/batchexecute",
    };
    lang = lang || "en";
    lang = lang.toLowerCase();

    if (!LANGUAGES[lang])
      resolve(global.rejectFSPR(`Language not supported: ${lang}`));

    const body = () => {
      const jsonString = JSON.stringify([
        [
          [
            "jQ1olc",
            `["${text}","${lang}", ${(slow ? true : null, "null")},"undefined",[0]]`,
            null,
            "generic",
          ],
        ],
      ]);
      const encodedData = encodeURIComponent(jsonString);
      return `f.req=${encodedData}`;
    };

    const request = () => {
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const slice = data.split("\n").slice(1).join("");
            const json = JSON.parse(slice);
            const dataString = json[0][2];
            const dataArray = JSON.parse(dataString);

            if (dataArray === null)
              resolve(
                global.rejectFSPR(
                  "Unable to parse audio data. Check your request params.",
                ),
              );

            const audioBuffer = Buffer.from(dataArray[0], "base64");
            resolve(global.resolveFSPR(audioBuffer));
          } catch (error) {
            resolve(global.rejectFSPR(error));
          }
        });
      });

      req.on("error", (error) => {
        resolve(global.rejectFSPR(error));
      });

      req.write(body());
      req.end();
    };
    request();
  });
};

module.exports = ToolGtts;
