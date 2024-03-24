## Fongsi Scraper

**@fongsi/scraper** adalah sebuah pustaka yang memungkinkan Anda untuk mengunduh berbagai jenis konten dari berbagai platform daring seperti TikTok, Instagram, Capcut, Google Drive, dan banyak lagi.

### Package Install Code

```bash
npm install @fongsi/scraper
```

### Cara Penggunaan

```javascript
const fongsi_scraper = require("@fongsi/scraper");

// Tiktok Downloader
fongsi_scraper
  .TiktokVideo("https://vm.tiktok.com/ZMMMHusqo/")
  .then(console.log);

// Instagram Downloader
fongsi_scraper
  .Instagram(
    "https://www.instagram.com/reel/C3iDBTSphq_/?igsh=MWlrcWVtcmZteW81eg==",
  )
  .then(console.log);

// Capcut Downloader
fongsi_scraper.Capcut("https://www.capcut.com/t/Zs86jhoGV/").then(console.log);

// Google Drive Downloader
fongsi_scraper
  .Drive(
    "https://drive.google.com/file/d/1WHofxVvVyW-PLX0BNrpyYQ3SxxPlY3nu/view?usp=drivesdk",
  )
  .then(console.log);

// MediaFire Downloader
fongsi_scraper
  .MediaFire(
    "https://www.mediafire.com/file/da52toz0dk3dmct/MediaFire_-_Getting_Started.pdf/file",
  )
  .then(console.log);

// Facebook Downloader
fongsi_scraper
  .Facebook(
    "https://www.facebook.com/100269398188116/videos/401714047588473/?mibextid=rS40aB7S9Ucbxw6v",
  )
  .then(console.log);

// Twitter Downloader
fongsi_scraper
  .Twitter("https://x.com/TamimAfghan010/status/1766677668630503559?s=20")
  .then(console.log);

// Spotify Downloader
fongsi_scraper
  .Spotify("https://open.spotify.com/track/1fSln3JhzB7Asdi83JTvPa")
  .then(console.log);

// Pinterest Downloader
fongsi_scraper
  .Pinterest("https://id.pinterest.com/pin/132152570309733412/")
  .then(console.log);

// Sfile Downloader
fongsi_scraper.Sfile("https://sfile.mobi/8mmp0wREIgm").then(console.log);

// YouTube Downloader
fongsi_scraper.YouTube.down("https://www.youtube.com/watch?v=EOLbOsMgwjY").then(
  console.log,
);

// YouTube Search
fongsi_scraper.YouTube.search("NCS").then(console.log);

// YouTube Search dengan Bahasa Tertentu
fongsi_scraper.YouTube.search("Never gonna give you up", {
  language: "fr-FR",
}).then(console.log);

// YouTube Search berdasarkan Jenis
fongsi_scraper.YouTube.search("NCS", {
  searchType: "channel",
}).then(console.log);

fongsi_scraper.YouTube.search("NCS", {
  searchType: "live",
}).then(console.log);

fongsi_scraper.YouTube.search("NCS", {
  searchType: "playlist",
}).then(console.log);
```

### Kode AutoDown

```javascript
// Gunakan AutoDL Parms(url) untuk mengunduh konten
fongsi_scraper
  .AutoDLParms("https://vm.tiktok.com/ZMMMHusqo/")
  .then(console.log);
```

### Credit

Pustaka ini dikembangkan oleh [@fongsidev](https://github.com/fongsidev).

### Kontribusi

Jika Anda ingin berkontribusi pada pengembangan pustaka ini, silakan kirimkan pull request atau buat masalah (issue) di repositori GitHub kami: [fongsidev/scraper](https://github.com/fongsidev/scraper).

### Lisensi

Pustaka ini dilisensikan di bawah [lisensi MIT](https://opensource.org/licenses/MIT).
