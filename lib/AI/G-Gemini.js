const https = require("https");

const AI_GGemini = (cookie, text, images) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "gemini.google.com",
      path: "/u/1/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20240325.04_p0&f.sid=6246003995104038349&hl=in&_reqid=1347121&rt=c",
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        cookie:
          typeof cookie === "object"
            ? Object.entries(cookie)
                .map(([key, val]) => `${key}=${val};`)
                .join("")
            : "__Secure-1PSID=" + cookie,
      },
    };
    const SNlM0e = {
      hostname: "gemini.google.com",
      path: "",
      method: "GET",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        cookie:
          typeof cookie === "object"
            ? Object.entries(cookie)
                .map(([key, val]) => `${key}=${val};`)
                .join("")
            : "__Secure-1PSID=" + cookie,
      },
    };

    let formatMarkdown = (text, images) => {
      if (!images) return text;
      for (let imageData of images) {
        const formattedTag = `!${imageData.tag}(${imageData.url})`;
        text = text.replace(
          new RegExp(`(?!\\!)\\[${imageData.tag.slice(1, -1)}\\]`),
          formattedTag,
        );
      }

      return text;
    };
    const getSNlM0e = () => {
      const req = https.request(SNlM0e, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          //const Tk_SNlM0e = responseText.match(/SNlM0e":"(.*?)"/)[1];
          console.log(data);
        });
      });

      req.on("error", (error) => {
        console.error(error);
      });

      req.end();
    };
    const body = async () => {
      const jsonString = JSON.stringify([
        null,
        `[["${text}?",0,null,null,null,null,0],["id"],["c_88e1534406bee7c7","r_d74b6cfa1d1ae56b","rc_c45965f5b240c339"],"","",null,[1],1,null,null,1,0,null,null,null,null,null,null,1,null,null,null,null,null,null,null,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,[]]`,
      ]);
      const encodedData = encodeURIComponent(jsonString);
      const At = await getSNlM0e();
      return `f.req=${encodedData}&at=AAFQ3XeZ92NBQJMGwOO5ReP-arJjx%3A1711519519118&`;
    };

    const request = async () => {
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const chatData = JSON.parse(JSON.parse(data.split("\n")[3])[0][2]);
            const answer = chatData[4][0];
            const text = answer[1][0];
            const images =
              answer[4]?.map((x) => ({
                tag: x[2],
                url: x[3][0][0],
                info: {
                  raw: x[0][0][0],
                  source: x[1][0][0],
                  alt: x[0][4],
                  website: x[1][1],
                  favicon: x[1][3],
                },
              })) ?? [];

            if (chatData === null)
              resolve({
                status: 404,
                msg: "Unable to parse audio data. Check your request params.",
              });

            resolve({
              status: 200,
              content: formatMarkdown(text, images),
              images: images,
              ids: {
                conversationID: chatData[1][0],
                responseID: chatData[1][1],
                choiceID: answer[0],
                _reqID: String(parseInt(0) + 100000),
              },
            });
          } catch (error) {
            resolve({
              status: 404,
              msg: error?.message || error,
            });
          }
        });
      });

      req.on("error", (error) => {
        resolve({
          status: 404,
          msg: error?.message || error,
        });
      });

      req.write(await body());
      req.end();
    };
    request();
  });
};

module.exports = AI_GGemini;
