const fs = require("fs");
const FongsiDev_Scraper = require("./");
const test = require("ava");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

console.log(FongsiDev_Scraper);

var LinkVideoTiktok =
  "https://www.tiktok.com/@akhwat_privatt05/video/7316508346620628230";

var LinkPictureTiktok =
  "https://www.tiktok.com/@mokmin_17/photo/7297251749482597638";

var LinkInstagram = "https://www.instagram.com/reel/C3iDBTSphq_";

var LinkCapcut = "https://www.capcut.com/t/Zs86jhoGV/";

var LinkDrive =
  "https://drive.google.com/file/d/1WHofxVvVyW-PLX0BNrpyYQ3SxxPlY3nu/view?usp=drivesdk";

var LinkMediaFire =
  "https://www.mediafire.com/file/da52toz0dk3dmct/MediaFire_-_Getting_Started.pdf/file";

var LinkFacebook =
  "https://www.facebook.com/100269398188116/videos/401714047588473/?mibextid=rS40aB7S9Ucbxw6v";

var LinkTwitter =
  "https://x.com/TamimAfghan010/status/1766677668630503559?s=20";

var LinkSpotify = "https://open.spotify.com/track/1fSln3JhzB7Asdi83JTvPa";

test("Test Download Video Tiktok", async (t) => {
  try {
    await sleep(1000);
    const E = await FongsiDev_Scraper.TiktokVideo(LinkVideoTiktok);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

test("Test Download Picture Tiktok", async (t) => {
  try {
    await sleep(3000);
    const E = await FongsiDev_Scraper.TiktokVideo(LinkPictureTiktok);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

test("Test Download Instagram", async (t) => {
  try {
    const E = await FongsiDev_Scraper.Instagram(LinkInstagram);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

test("Test Download Capcut", async (t) => {
  try {
    const E = await FongsiDev_Scraper.Capcut(LinkCapcut);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

test("Test Download Drive", async (t) => {
  try {
    const E = await FongsiDev_Scraper.Drive(LinkDrive);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

test("Test Download MediaFire", async (t) => {
  try {
    const E = await FongsiDev_Scraper.MediaFire(LinkMediaFire);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

test("Test Download Facebook", async (t) => {
  try {
    const E = await FongsiDev_Scraper.Facebook(LinkFacebook);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

test("Test Download Twitter", async (t) => {
  try {
    const E = await FongsiDev_Scraper.Twitter(LinkTwitter);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

test("Test Download Spotify", async (t) => {
  try {
    const E = await FongsiDev_Scraper.Spotify(LinkSpotify);
    if (E.status !== 200) {
      t.log(E);
    }
    console.log(E);
    t.is(E, E);
  } catch (err) {
    t.log(err);
  }
});

/*(async () => {


  await sleep(5000);
  console.clear();
  console.log("Drive");
  await sleep(5000);

  //Drive;
  FongsiDev_Scraper.Drive(
    "",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("MediaFire");
  await sleep(5000);

  //MediaFire;
  FongsiDev_Scraper.MediaFire(
    "https://www.mediafire.com/file/da52toz0dk3dmct/MediaFire_-_Getting_Started.pdf/file",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Facebook");
  await sleep(5000);

  //FaceBook;
  FongsiDev_Scraper.Facebook(
    "https://www.facebook.com/100269398188116/videos/401714047588473/?mibextid=rS40aB7S9Ucbxw6v",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Twitter");
  await sleep(5000);

  //Twitter;
  FongsiDev_Scraper.Twitter(
    "",
  ).then(console.log);
  
  await sleep(5000);
  console.clear();
  console.log("Spotify");
  await sleep(5000);

  //Spotify;
  FongsiDev_Scraper.Spotify(
    "",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Pinterest");
  await sleep(5000);

  //Pinterest;
  FongsiDev_Scraper.Pinterest(
    "https://id.pinterest.com/pin/132152570309733412/",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Sfile");
  await sleep(5000);

  //Pinterest;
  FongsiDev_Scraper.Pinterest("https://sfile.mobi/8mmp0wREIgm").then(
    console.log,
  );

  await sleep(5000);
  console.clear();
  console.log("YouTube Dl");
  await sleep(5000);

  //YouTube;
  FongsiDev_Scraper.YouTube.down(
    "https://www.youtube.com/watch?v=EOLbOsMgwjY",
  ).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Search");
  await sleep(5000);

  FongsiDev_Scraper.YouTube.search("NCS").then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Language");
  await sleep(5000);

  FongsiDev_Scraper.YouTube.search("Never gonna give you up", {
    language: "fr-FR",
  }).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Type: Channel");
  await sleep(5000);

  FongsiDev_Scraper.YouTube.search("NCS", {
    searchType: "channel",
  }).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Type: Live");
  await sleep(5000);

  FongsiDev_Scraper.YouTube.search("NCS", {
    searchType: "live",
  }).then(console.log);

  await sleep(5000);
  console.clear();
  console.log("Type: Playlist");
  await sleep(5000);

  FongsiDev_Scraper.YouTube.search("NCS", {
    searchType: "playlist",
  }).then(console.log);
})();

//Google Text To Speech
FongsiDev_Scraper.Gtts("Hello World", "en").then(console.log);
*/

//Gemini Google ( Not finished yet )
/*FongsiDev_Scraper.GGemini(
  "<cookies _U>",
  "helo",
).then(console.log);
*/

//Translator
/*new FongsiDev_Scraper.Translator("Hello friends", "id")
  .translate()
  .then(console.log);
*/

//Google Lens Url or Buffer
/*FongsiDev_Scraper.GoogleLens(
  "https://telegra.ph/file/f0ff2f9f373c962d8e2e5.jpg",
).then(console.log);

readFile("./tmp/4420937.png").then((data) => {
  console.log("Isi file:", data);
  FongsiDev_Scraper.GoogleLens(data).then(console.log);
});*/

//FAIIGGTranslate AI
/*new FongsiDev_Scraper.FAIIGGTranslate("<Cookies _qurn=**>")
  .translate("Hello friends", "id")
  .then(console.log);
*/

//Remove Background
//V1
/*
FongsiDev_Scraper.RemoveBg.v1("<url/pathfile>").then(console.log);
*/
//V2
/*
FongsiDev_Scraper.RemoveBg.v2("<pathfile>").then(console.log);
*/

//KarloAI
/*const karloAI = new FongsiDev_Scraper.KarloAI("YOUR_TOKEN_HERE");

karloAI
  .generateImage({
    prompt: "<YOUR_PROMPT>",
    negativePrompt: "<YOUR_NEGATIGE_PROMPT>",
  })
  .then((data) => {
    console.log("Generated image data:", data);
  })
  .catch((error) => {
    console.error("Error generating image:", error);
  });*/
