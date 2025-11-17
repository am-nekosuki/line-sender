const express = require('express');
const axios = require('axios');
const app = express();

// Render の環境変数を使う
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const GROUP_ID = process.env.GROUP_ID;
const FIXED_USER_ID = process.env.MENTION_USER_ID;

// ワンクリックで送信するAPI
app.get('/send', async (req, res) => {
  try {
    const message = {
      to: GROUP_ID,
      messages: [
        {
          type: 'text',
          text: '＠たろう ミーティングお願いします！',
          mention: {
            mentionees: [
              {
                type: 'user',
                userId: FIXED_USER_ID,
                index: 0,
                length: 3
              }
            ]
          }
        }
      ]
    };

    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      message,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }
    );

    res.send("送信完了！");
  } catch (e) {
    console.error(e);
    res.status(500).send("エラーが発生しました");
  }
});

// Render 必須：PORT を listen して永続化
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
