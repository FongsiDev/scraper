## FongsiDev Scraper

**@fongsidev/scraper** is a library that allows you to download various types of content from various online platforms such as TikTok, Instagram, Capcut, Google Drive, and many more and also provides very useful tools/codes :).

### Package Install Code

```bash
npm install @fongsidev/scraper
```

### Method of use

```javascript
const FongsiDev_Scraper = require("@fongsidev/scraper");

// Tiktok Downloader
FongsiDev_Scraper.TiktokVideo("https://vm.tiktok.com/ZMMMHusqo/").then(
  console.log,
);

// Instagram Downloader
FongsiDev_Scraper.Instagram(
  "https://www.instagram.com/reel/C3iDBTSphq_/?igsh=MWlrcWVtcmZteW81eg==",
).then(console.log);

// Capcut Downloader
FongsiDev_Scraper.Capcut("https://www.capcut.com/t/Zs86jhoGV/").then(
  console.log,
);

// Google Drive Downloader
FongsiDev_Scraper.Drive(
  "https://drive.google.com/file/d/1WHofxVvVyW-PLX0BNrpyYQ3SxxPlY3nu/view?usp=drivesdk",
).then(console.log);

// MediaFire Downloader
FongsiDev_Scraper.MediaFire(
  "https://www.mediafire.com/file/da52toz0dk3dmct/MediaFire_-_Getting_Started.pdf/file",
).then(console.log);

// Facebook Downloader
FongsiDev_Scraper.Facebook(
  "https://www.facebook.com/100269398188116/videos/401714047588473/?mibextid=rS40aB7S9Ucbxw6v",
).then(console.log);

// Twitter Downloader
FongsiDev_Scraper.Twitter(
  "https://x.com/TamimAfghan010/status/1766677668630503559?s=20",
).then(console.log);

// Spotify Downloader
FongsiDev_Scraper.Spotify(
  "https://open.spotify.com/track/1fSln3JhzB7Asdi83JTvPa",
).then(console.log);

// Pinterest Downloader
FongsiDev_Scraper.Pinterest(
  "https://id.pinterest.com/pin/132152570309733412/",
).then(console.log);

// Sfile Downloader
FongsiDev_Scraper.Sfile("https://sfile.mobi/8mmp0wREIgm").then(console.log);

// YouTube Downloader
FongsiDev_Scraper.YouTube.down(
  "https://www.youtube.com/watch?v=EOLbOsMgwjY",
).then(console.log);

// YouTube Search
FongsiDev_Scraper.YouTube.search("NCS").then(console.log);

// YouTube Search dengan Bahasa Tertentu
FongsiDev_Scraper.YouTube.search("Never gonna give you up", {
  language: "fr-FR",
}).then(console.log);

// YouTube Search berdasarkan Jenis
FongsiDev_Scraper.YouTube.search("NCS", {
  searchType: "channel",
}).then(console.log);

FongsiDev_Scraper.YouTube.search("NCS", {
  searchType: "live",
}).then(console.log);

FongsiDev_Scraper.YouTube.search("NCS", {
  searchType: "playlist",
}).then(console.log);
```

### Code AutoDown

```javascript
// Use AutoDL Parms(url) to download content
FongsiDev_Scraper.AutoDLParms("https://vm.tiktok.com/ZMMMHusqo/").then(
  console.log,
);
```

## Google Text To Speech

```javascript
FongsiDev_Scraper.Gtts("Hello World", "en").then(console.log);
```

## Google Translator

```javascript
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

## Google Lens

```javascript
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

## Short URL

```javascript
//Website: https://shorter.me/
FongsiDev_Scraper.Short1("https://google.com").then(console.log);
```

## Translate AI Web: www.freeaiimagegenerator.org

```
new FongsiDev_Scraper.FAIIGGTranslate(
"<Cookies _qurn=**>",
)
.translate("Hello friends", "id", /*quality, tone, max_results*/)
.then(console.log);

//Quality
/*
   * Premium: 1
   * Good: 0.75 <Default>
   * Economy: 0.25
   * Average: 0.5
*/

//Tone
/*
   * Funny: funny
   * Casual: casual
   * Excited: excited
   * Professional: professional <Default>
   * Witty: witty
   * Sarcastic: sarcastic
   * Feminine: feminine
   * Masculine: masculine
   * Bold: bold
   * Dramatic: dramatic
   * Gumpy: gumpy
   * Secretive: secretive
*/
```

### Credits

This library was developed by [@FongsiDev](https://github.com/fongsidev).

### Contribution

If you would like to contribute to the development of this library, please submit a pull request or create an issue in our GitHub repository: [FongsiDev/scraper](https://github.com/fongsidev/scraper).

### Licence

This library is licensed under the [MIT license](https://opensource.org/licenses/MIT).
