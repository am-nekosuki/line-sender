import express from "express";
import axios from "axios";

const app = express();

// Render の環境変数で設定する
const CHANNEL_ACCESS_TOKEN = process.env.LINE_TOKEN;
const GROUP_ID = process.env.GROUP_ID;

// ここを好きな固定メッセージに変えられます
const MESSAGE = "@菊池　";

app.get("/", (req, res) => {
  res.send("LINE Sender is running");
});

app.get("/send", async (req, res) => {
  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: GROUP_ID,
        messages: [
          {
            type: "text",
            text: MESSAGE
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }
    );
    res.send("Message Sent!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending message");
  }
});

app.listen(3000, () => console.log("Server started"));
