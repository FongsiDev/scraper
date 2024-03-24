const AllOneDownloader = require("./");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log(AllOneDownloader);
(async () => {
  //Tiktok; Video
  console.log("Tiktok Video");
  await sleep(5000);
  AllOneDownloader.TiktokVideo("https://vm.tiktok.com/ZMMMHusqo/").then(
    console.log,
  );

  await sleep(5000);
  console.clear();
  console.log("Tiktok Image");
  await sleep(5000);

  //Tiktok; Image
  AllOneDownloader.TiktokVideo("https://vm.tiktok.com/ZMMMH29hq/").then(
    console.log,
  );

  await sleep(5000);
  console.clear();
  console.log("Instagram");
  await sleep(5000);

  //Instagram;
  AllOneDownloader.Instagram(
    "https://www.instagram.com/reel/C3iDBTSphq_/?igsh=MWlrcWVtcmZteW81eg==",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Capcut");
  await sleep(5000);

  //Capcut;
  AllOneDownloader.Capcut("https://www.capcut.com/t/Zs86jhoGV/").then(
    console.log,
  );

  await sleep(5000);
  console.clear();
  console.log("Drive");
  await sleep(5000);

  //Drive;
  AllOneDownloader.Drive(
    "https://drive.google.com/file/d/1WHofxVvVyW-PLX0BNrpyYQ3SxxPlY3nu/view?usp=drivesdk",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("MediaFire");
  await sleep(5000);

  //MediaFire;
  AllOneDownloader.MediaFire(
    "https://www.mediafire.com/file/da52toz0dk3dmct/MediaFire_-_Getting_Started.pdf/file",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Facebook");
  await sleep(5000);

  //FaceBook;
  AllOneDownloader.Facebook(
    "https://www.facebook.com/100269398188116/videos/401714047588473/?mibextid=rS40aB7S9Ucbxw6v",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Twitter");
  await sleep(5000);

  //Twitter;
  AllOneDownloader.Twitter(
    "https://x.com/TamimAfghan010/status/1766677668630503559?s=20",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Spotify");
  await sleep(5000);

  //Spotify;
  AllOneDownloader.Spotify(
    "https://open.spotify.com/track/1fSln3JhzB7Asdi83JTvPa",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Pinterest");
  await sleep(5000);

  //Pinterest;
  AllOneDownloader.Pinterest(
    "https://id.pinterest.com/pin/132152570309733412/",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Sfile");
  await sleep(5000);

  //Pinterest;
  AllOneDownloader.Pinterest("https://sfile.mobi/8mmp0wREIgm").then(
    console.log,
  );

  await sleep(5000);
  console.clear();
  console.log("YouTube Dl");
  await sleep(5000);

  //YouTube;
  AllOneDownloader.YouTube.down(
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
