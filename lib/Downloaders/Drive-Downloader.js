const { URL } = require("url");
const fetch = require("node-fetch");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
const isID = (str) => /^[a-zA-Z0-9_-]{8,64}$/.test(str);
const isUrl = (str) => /^https?:\/\//.test(str);
const validateStatus = (status) => status >= 200 && status < 400;

function getItemId(url) {
  return new Promise(async (resolve, reject) => {
    const parsed = await parseUrl(url);
    if (parsed.searchParams.has("id")) resolve(parsed.searchParams.get("id"));
    const segments = parsed.pathname.split("/");
    const index = segments.findIndex((it) => it === "d");
    if (index === -1)
      reject(new TypeError(`Failed to extract id from url: ${url}`));
    else resolve(segments[index + 1]);
  });
}

function parseUrl(url) {
  return new Promise((resolve, reject) => {
    try {
      resolve(new URL(url));
    } catch (err) {
      reject(err);
    }
  });
}

function abbreviateNumber(number) {
  const SI_POSTFIXES = ["", "KB", "MB", "GB", "TB"];
  const sign = number < 0 ? "-1" : "";
  const absNumber = Math.abs(number);
  const tier = (Math.log10(absNumber) / 3) | 0;
  if (tier == 0) return `${absNumber}`;
  const postfix = SI_POSTFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = absNumber / scale;
  const floored = Math.floor(scaled * 10) / 10;
  let str = floored.toFixed(1);
  str = /\.0$/.test(str) ? str.substr(0, str.length - 2) : str;
  return `${sign}${str}${postfix}`;
}

function getFileNameSize(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);

      if (response.headers.has("content-disposition")) {
        const contentDisposition = response.headers.get("content-disposition");
        const match = contentDisposition.match(/filename="(.+?)"/);
        const fileName = match ? match[1] : null;

        const contentType = response.headers.get("content-type");

        const contentSize = response.headers.get("content-length");
        const fileSize = contentSize ? parseInt(contentSize, 10) : null;

        resolve({
          fileName: fileName ?? "",
          contentType: contentType ?? "",
          fileSize: abbreviateNumber(fileSize ?? 0),
          fileSizeB: fileSize ?? 0,
        });
      } else {
        resolve({
          fileName: "",
          contentType: "",
          fileSize: abbreviateNumber(fileSize ?? 0),
          fileSizeB: 0,
        });
      }
    } catch (error) {
      resolve({
        fileName: "",
        contentType: "",
        fileSize: abbreviateNumber(fileSize ?? 0),
        fileSizeB: 0,
      });
    }
  });
}

async function getIdDrive(url, skip = false) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!isUrl(url) || !/drive\.google\.com/i.test(url))
        throw new Error("Invalid URL: " + url);

      const docID = await getItemId(url);
      const url_ = skip
        ? url
        : `https://drive.google.com/uc?id=${docID}&export=download`;
      const response = await fetch(url_, { redirect: "manual" });
      if (validateStatus(response.status) && response.headers.has("location")) {
        const redirectedUrl = response.headers.get("location");
        const isGoogleHost = redirectedUrl.includes("googleusercontent.com");
        if (redirectedUrl && isGoogleHost) {
          let FileInfo = await getFileNameSize(redirectedUrl);
          resolve({
            downloadUrl: redirectedUrl,
            ...FileInfo,
          });
        } else {
          resolve(url_);
        }
      } else if (
        validateStatus(response.status) &&
        !response.headers.has("location")
      ) {
        const htmlResponse = await fetch(url_).then((res) => res.text());
        const dom = new JSDOM(htmlResponse);
        const formAction = dom.window.document
          .querySelector("form")
          .getAttribute("action");
        resolve(getIdDrive(formAction, true));
      } else {
        resolve(url_);
      }
    } catch (error) {
      resolve(error);
    }
  });
}
async function GDriveDl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!global.isUrlFSPR(url) || !/drive\.google\.com/i.test(url)) {
        return global.rejectFSPR("Invalid URL: " + url);
      }

      const docID = await getItemId(url);

      const res = await fetch(
        `https://drive.google.com/uc?id=${docID}&authuser=0&export=download`,
        {
          method: "post",
          headers: {
            "accept-encoding": "gzip, deflate, br",
            "content-length": 0,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            origin: "https://drive.google.com",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
            "x-drive-first-party": "DriveWebUi",
            "x-json-requested": "true",
          },
        },
      );
      const { fileName, sizeBytes, downloadUrl } = JSON.parse(
        (await res.text()).slice(4),
      );
      if (!downloadUrl) {
        resolve(global.rejectFSPR("Link Download Limit!"));
      }
      const data = await fetch(downloadUrl);
      if (data.status !== 200) {
        resolve(global.rejectFSPR(data.statusText));
      }
      resolve(
        global.resolveFSPR({
          downloadUrl,
          fileName,
          fileSize: abbreviateNumber(sizeBytes),
          mimetype: data.headers.get("content-type"),
        }),
      );
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
}

module.exports = GDriveDl;
