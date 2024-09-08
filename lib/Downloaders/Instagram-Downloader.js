const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

const instagramDl = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(url) || !/instagram\.com/i.test(url))
        return global.rejectFSPR("Invalid URL: " + url);

      const apiUrl = "https://v3.savevid.net/api/ajaxSearch";
      const params = {
        q: url,
        t: "media",
        lang: "en",
        v: 'v2'
      };

      const headers = {
        Accept: "*/*",
        Origin: "https://savevid.net",
        Referer: "https://savevid.net/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded",
        "Sec-Ch-Ua":
          '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183",
        "X-Requested-With": "XMLHttpRequest",
      };

      const config = {
        headers,
      };

      const response = await axios.post(apiUrl, qs.stringify(params), config);
      const responseData = response.data.data;

      const result = [];

      // Extract the obfuscated string part
      var obfuscatedString = responseData.match(/eval\(function\(h,u,n,t,e,r\)\{.*?\}\("([^"]+)",1,"abcdefghi",1,2,1\)\)/)[1];

      // Define the decoding function based on the extracted part
      var _0xc0e = ["","split","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/","slice","indexOf","","",".","pow","reduce","reverse","0"];
      function _0xe0c(d, e, f) {
          var g = _0xc0e[2][_0xc0e[1]](_0xc0e[0]);
          var h = g[_0xc0e[3]](0, e);
          var i = g[_0xc0e[3]](0, f);
          var j = d[_0xc0e[1]](_0xc0e[0])
              [_0xc0e[10]]()
              [_0xc0e[9]](function (a, b, c) {
                  if (h[_0xc0e[4]](b) !== -1) return (a += h[_0xc0e[4]](b) * Math[_0xc0e[8]](e, c));
              }, 0);
          var k = _0xc0e[0];
          while (j > 0) {
              k = i[j % f] + k;
              j = (j - (j % f)) / f;
          }
          return k || _0xc0e[11];
      }
      function decode(obfuscatedString) {
          return (function (h, u, n, t, e, r) {
              r = "";
              for (var i = 0, len = h.length; i < len; i++) {
                  var s = "";
                  while (h[i] !== n[e]) {
                      s += h[i];
                      i++;
                  }
                  for (var j = 0; j < n.length; j++) s = s.replace(new RegExp(n[j], "g"), j);
                  r += String.fromCharCode(_0xe0c(s, e, 10) - t);
              }
              return decodeURIComponent(r);
          })(obfuscatedString, 1, "abcdefghi", 1, 2, 1);
      }

      // Decode the obfuscated string
      var decodedString = decode(obfuscatedString);

      var urls = [];
      var urlRegex = /https?:\/\/[^\s"]+/g;
      var match;

      while ((match = urlRegex.exec(decodedString)) !== null) {
          urls.push(match[0].replace('\\', ''));
      }


      result.push({
        thumbnail_link: urls[1],
        download_link: urls[2],
      });

      resolve(global.resolveFSPR(result));
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
};

module.exports = instagramDl;
