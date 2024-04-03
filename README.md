## Fongsi Scraper

**@fongsidev/scraper** adalah sebuah pustaka yang memungkinkan Anda untuk mengunduh berbagai jenis konten dari berbagai platform daring seperti TikTok, Instagram, Capcut, Google Drive, dan banyak lagi.

### Package Install Code

```bash
npm install @fongsidev/scraper
```

### Cara Penggunaan

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

### Kode AutoDown

```javascript
// Gunakan AutoDL Parms(url) untuk mengunduh konten
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

### Credit

Pustaka ini dikembangkan oleh [@FongsiDev](https://github.com/fongsidev).

### Kontribusi

Jika Anda ingin berkontribusi pada pengembangan pustaka ini, silakan kirimkan pull request atau buat masalah (issue) di repositori GitHub kami: [FongsiDev/scraper](https://github.com/fongsidev/scraper).

### Lisensi

Pustaka ini dilisensikan di bawah [lisensi MIT](https://opensource.org/licenses/MIT).
