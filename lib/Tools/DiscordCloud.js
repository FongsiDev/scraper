const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

class Tool_DiscordCloud {
  constructor({
    token,
    webhooks = [],
    channelId,
    CHUNK_SIZE = 8 * 1024 * 1024,
    RANGE_SIZE = 5242880,
  }) {
    if (token) {
      if (channelId) {
        this.channelId = channelId;
        this.isBot = true;
      } else {
        throw new Error("Channel harus disediakan jika token diberikan.");
      }
    } else if (webhooks.length === 0) {
      throw new Error(
        "Setidaknya satu webhook harus disediakan jika token tidak diberikan.",
      );
    }

    this.token = token;
    this.webhooks = webhooks;
    this.CHUNK_SIZE = CHUNK_SIZE;
    this.RANGE_SIZE = RANGE_SIZE;
    this.uploadingCount = 0;
    this.LC = 0;
  }

  getRandomWebhook() {
    if (this.webhooks.length === 0) {
      throw new Error("Daftar webhook kosong.");
    }

    const randomIndex = Math.floor(Math.random() * this.webhooks.length);
    const webhook = this.webhooks[randomIndex];
    const W = webhook.match(/discord.com\/api\/webhooks\/([^\/]+)\/([^\/]+)/);
    return `https://discordapp.com/api/webhooks/${W[1]}/${W[2]}`;
  }

  async fetchBuffer(url) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(response.data);
    } catch (error) {
      console.error("Error fetching buffer:", error);
      throw error;
    }
  }

  async toFile(urls) {
    const buffers = await Promise.all(urls.map((url) => this.fetchBuffer(url)));
    return Buffer.concat(buffers);
  }

  async toUrl(buffer, filename) {
    const chunks = this.splitBuffer(buffer, this.CHUNK_SIZE);
    const urls = [];
    this.LC += buffer.length;
    for (const chunk of chunks) {
      const url = await this.uploadChunk(chunk, filename);
      urls.push(url);
    }
    return urls;
  }

  async uploadChunk(chunk, filename) {
    const formData = new FormData();
    formData.append("files[0]", chunk, { filename });
    const content = `\`\`\`\nFile Name: ${filename}\nFile Size: ${this.metricNumbers(
      chunk.length,
    )}(${chunk.length})\nChunk Count: ${this.uploadingCount}\nChunk Size File: ${this.LC}\`\`\``;
    formData.append("payload_json", JSON.stringify({ content }));

    const url = this.isBot
      ? `https://discord.com/api/channels/${this.channelId}/messages`
      : this.getRandomWebhook();
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bot ${this.token}`,
    };
    await this.wait(this.uploadingCount++ * 1000);

    const result = (
      await axios
        .post(url, formData, { headers })
        .catch(async (err) => {
          // Auto retry if the request is rate limited recursively
          await this.wait(+err.response.headers["x-ratelimit-reset-after"]);
          return {
            data: {
              attachments: [
                {
                  url: await this.uploadChunk(chunk, filename),
                },
              ],
            },
          };
        })
        .finally(() => this.uploadingCount--)
    ).data;
    if (!result?.attachments?.[0]?.url) {
      throw new Error("Cannot find attachments when uploading");
    }
    return result.attachments[0].url;
  }

  splitBuffer(buffer, size) {
    const chunks = [];
    let offset = 0;
    while (offset < buffer.length) {
      const chunkSize = Math.min(size, buffer.length - offset);
      chunks.push(buffer.slice(offset, offset + chunkSize));
      offset += chunkSize;
    }
    return chunks;
  }

  async upload(buffer, filename) {
    /*if (!this.token || this.webhooks.length === 0) {
      throw new Error(
        "Token dan setidaknya satu webhook harus disediakan untuk mengunggah file.",
      );
    }*/

    return this.toUrl(buffer, filename);
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  metricNumbers(value) {
    const types = ["", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const selectType = (Math.log10(value) / 3) | 0;
    if (selectType == 0) return value;
    let scaled = value / Math.pow(10, selectType * 3);
    return scaled.toFixed(1) + types[selectType];
  }
}

module.exports = Tool_DiscordCloud;
