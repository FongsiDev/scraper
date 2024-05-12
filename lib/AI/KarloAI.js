const axios = require("axios");

class KarloAI {
  constructor(token) {
    if (!token) {
      return global.throwFSPR("Token is required for KarloAI class.");
    }
    this.token = token;
  }

  async generateImage(options) {
    try {
      const response = await axios.post(
        "https://karlo.ai/api/was/t2i",
        {
          ...options,
          rid: `FE-${this.generateID()}`,
          withHistory: true,
          isPrivate: true,
          seed: 0,
          batchCount: 4,
          batchSize: 1,
          width: 1024,
          height: 1024,
          inferenceSteps: 50,
          guidanceScale: 5,
          addSymbol: false,
          target: "generation",
          model: "karlo",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Request-Id": `FongsiDev/Scraper/Request-ID-FE-${this.generateID()}`,
            Authorization: `Bearer ${this.token}`,
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
            Referer: "https://karlo.ai/generation",
          },
        },
      );

      const data = response.data;
      data.history = this.transformIdToUrl(data.history);
      return global.resolveFSPR(data);
    } catch (error) {
      return global.rejectFSPR(error);
    }
  }

  transformIdToUrl(data) {
    const baseUrl = "https://karlo.ai/api/image/t2i/";
    data.images.forEach((image) => {
      image.id = baseUrl + image.id;
    });
    return data;
  }

  generateID() {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    randomString = randomString.substr(0, 15) + randomString.substr(16);
    return randomString;
  }
}

module.exports = KarloAI;
