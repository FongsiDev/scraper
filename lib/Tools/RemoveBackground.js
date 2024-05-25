const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const getfile = require("getfile-fs");
const path = require("path");

class ImageRemovalAPI {
  constructor() {
    this.apiBaseUrl = "https://api.removal.ai";
    this.apiTokenUrl = this.apiBaseUrl + "/web-token/request";
    this.apiRemoveUrl = this.apiBaseUrl + "/3.0/remove";
    this.trustToken = null;
    this.regex1 =
      /\(\(\(new Function\('try{return this!==window;}catch\(e\){ return true;}'\)\)\(\)\)\)\?(\d+):(\d+)/gm;
    this.dom = new JSDOM("null", {
      pretendToBeVisual: false,
    });
    global.window = this.window = this.dom.window;
    this.document = this.dom.window.document;
    this.location = this.dom.window.location;
    Object.defineProperty(this.document.body, "childElementCount", {
      get() {
        return 9;
      },
    });
  }

  async getTrustTokenAsync() {
    let maxTry = 5;
    let data = await this.ajaxPostJson(
      this.apiTokenUrl,
      null,
      this.trustToken ? { "WEB-TOKEN": this.trustToken } : null,
    );
    var location = this.location;
    var document = this.document;
    var window = this.window;
    while (data.challenge && maxTry-- > 0) {
      const nums = eval(
        atob(data.response)
          .replace(/return this!==window;/i, "return false;")
          .replace(/location.href.includes('removal')/i, "true"),
      );
      const response = btoa(
        JSON.stringify(nums.map((v, i) => (v * 2 + i) * 2)),
      );
      data = await this.ajaxPostJson(this.apiTokenUrl, {
        challenge: data.challenge,
        response: response,
      });
    }
    this.trustToken = data.token;
    return this.trustToken;
  }

  async removeBackground(imagePath) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!imagePath)
          resolve(global.rejectFSPR("Please Where is the Image Path"));
        const trustToken = await this.getTrustTokenAsync();
        const formData = new FormData();
        formData.append(
          "image_file",
          fs.createReadStream(path.join(imagePath)),
        );
        formData.append("get_file", 1);
        const response = await axios.post(this.apiRemoveUrl, formData, {
          headers: {
            "web-token": trustToken,
            ...formData.getHeaders(),
          },
          responseType: "stream",
        });
        const bufs = [];
        response.data.on("data", function (d) {
          bufs.push(d);
        });

        response.data.on("end", function () {
          const resultBuffer = Buffer.concat(bufs);
          resolve(global.resolveFSPR(resultBuffer));
        });
      } catch (error) {
        resolve(global.rejectFSPR(error));
      }
    });
  }

  async ajaxPostJson(
    url,
    data,
    customHeaders = null,
    responseDataType = "json",
  ) {
    try {
      const response = await axios.post(url, data, {
        headers: {
          ...customHeaders,
          "Content-Type": "application/json",
        },
        responseType: responseDataType,
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  objectToFormData(data) {
    const form_data = new FormData();
    for (const key in data) {
      if (data[key] instanceof File) {
        form_data.append(key, data[key], data[key].name);
      } else {
        form_data.append(key, data[key]);
      }
    }
    return form_data;
  }
}

function ToolRemoveBgv1(imagePath) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!imagePath)
        resolve(global.rejectFSPR("Please Where is the Image Path or URL?"));
      // Langkah pertama: Dapatkan URL host
      const responseHost = await axios.get(
        "https://www.onlineconverter.com/get/host",
        {
          headers: {
            authority: "www.onlineconverter.com",
            accept: "*/*",
            "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
            referer: "https://www.onlineconverter.com/remove-image-background",
            "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          },
        },
      );

      const urlHost = responseHost.data;
      const imageBuffer = await getfile(imagePath);
      if (!imageBuffer.data && imageBuffer.res?.status !== 200)
        resolve({ status: 404, msg: imageBuffer.res?.statusText });
      // Langkah kedua: Upload gambar
      const form = new FormData();
      form.append("file", imageBuffer.data, {
        filename: `${Date.now()}.${imageBuffer.ext}`,
      });
      form.append("select", "1");
      form.append("class", "tool");
      form.append("from", "image");
      form.append("to", "remove-image-background");
      form.append("source", "online");

      const responseUpload = await axios.post(urlHost, form, {
        headers: {
          ...form.getHeaders(),
          authority: urlHost,
          accept: "*/*",
          "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
          origin: "https://www.onlineconverter.com",
          referer: "https://www.onlineconverter.com/",
          "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
      });
      const resultUrl = responseUpload.data;
      const id = resultUrl.match(/(?:convert\/)(\w+)/)[1];
      const newUrl = `${urlHost.split("/send").join("")}/${id}`;
      const responseDownload = await axios.get(newUrl, {
        headers: {
          authority: urlHost,
          accept: "*/*",
          "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
          origin: "https://www.onlineconverter.com",
          referer: "https://www.onlineconverter.com/",
          "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
      });
      // Membuat URL baru dengan ID
      resolve(global.resolveFSPR(newUrl + "/download"));
    } catch (error) {
      resolve(global.rejectFSPR(error));
    }
  });
}
function ToolRemoveBgv2(imagePath) {
  const imageRemoval = new ImageRemovalAPI();
  return imageRemoval.removeBackground(imagePath);
}

module.exports = { v1: ToolRemoveBgv1, v2: ToolRemoveBgv2 };
