const axios = require('axios');

const CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';
const GROUP_ID = 'YOUR_GROUP_ID';

// ★毎回同じ人をメンション
const FIXED_USER_ID = 'Uxxxxxxxxxxxxxxxx';

async function sendMessage() {
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

  console.log('送信完了');
}

sendMessage();
