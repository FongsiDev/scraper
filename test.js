const AllOneDownloader = require("./");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log(AllOneDownloader);
//Tiktok; Video
AllOneDownloader.TiktokVideo("https://vt.tiktok.com/ZSNgav3uQ/").then(
  console.log,
);
/*
//Tiktok; Image
AllOneDownloader.TiktokVideo("https://vt.tiktok.com/ZSNgmJ7X6/").then(console.log);

//Instagram;
AllOneDownloader.Instagram("https://www.instagram.com/reel/C1O4cNurC0M/?igsh=MTdsNGRybXlkdGY2Mg==").then(console.log);

//Capcut;
AllOneDownloader.Capcut(
  "https://www.capcut.com/template-detail/716362991950122247?template_id=7316362991950122247&share_token=6b7d6a7e-f8b4-478c-8117-30f755cb5f64&enter_from=template_detail&region=ID&language=ms&platform=copy_link&is_copy_link=1",
).then(console.log);

//Drive;
AllOneDownloader.Drive(
  "https://drive.google.com/file/d/1Fx_0Lnzh0rB5sd8JN5MgJQxEJObdqKur/view?usp=drivesdk",
).then(console.log);

//MediaFire;
AllOneDownloader.MediaFire(
  "https://www.mediafire.com/file/da52toz0dk3dmct/MediaFire_-_Getting_Started.pdf/file",
).then(console.log);

//FaceBook;
AllOneDownloader.Facebook(
  "https://www.facebook.com/reel/159235521555461/?mibextid=rS40aB7S9Ucbxw6v",
).then(console.log);

//Twitter;
AllOneDownloader.Twitter(
  "https://x.com/MiskinTV_/status/1741343489751908363?s=20",
).then(console.log);

//Spotify;
AllOneDownloader.Spotify(
  "https://open.spotify.com/track/1fSln3JhzB7Asdi83JTvPa",
).then(console.log);

//Pinterest;
AllOneDownloader.Pinterest(
  "https://id.pinterest.com/pin/132152570309733412/",
).then(console.log);

//YouTube;
(async () => {
  AllOneDownloader.YouTube.ytdl(
    "https://www.youtube.com/watch?v=EOLbOsMgwjY",
  ).then(console.log);
  await sleep(5000);
  console.clear();

  console.log("Search");
  await sleep(5000);
  AllOneDownloader.YouTube.search("NCS").then(console.log);
  await sleep(5000);
  console.clear();

  console.log("Language");
  await sleep(5000);
  AllOneDownloader.YouTube.search("Never gonna give you up", {
    language: "fr-FR",
  }).then(console.log);
  await sleep(5000);
  console.clear();

  console.log("Type: Channel");
  await sleep(5000);
  AllOneDownloader.YouTube.search("NCS", {
    searchType: "channel",
  }).then(console.log);
  await sleep(5000);
  console.clear();

  console.log("Type: Live");
  await sleep(5000);
  AllOneDownloader.YouTube.search("NCS", {
    searchType: "live",
  }).then(console.log);
  await sleep(5000);
  console.clear();

  console.log("Type: Playlist");
  await sleep(5000);
  AllOneDownloader.YouTube.search("NCS", {
    searchType: "playlist",
  }).then(console.log);
})();
*/
