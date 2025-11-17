const express = require('express');
const axios = require('axios');

const app = express();

// Render の環境変数
const CHANNEL_ACCESS_TOKEN = process.env.LINE_TOKEN;
const GROUP_ID = process.env.GROUP_ID;
const FIXED_USER_ID = process.env.MENTION_USER_ID;

// ① 画面表示用（送信ボタン付きページ）
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>LINE送信ボタン</title>
      <style>
        body { font-family: sans-serif; padding: 40px; }
        button {
          font-size: 18px;
          padding: 10px 24px;
          cursor: pointer;
        }
        #status { margin-top: 16px; }
      </style>
    </head>
    <body>
      <h1>T</h1>
      <p>下のボタンを押すと、メッセージを1回送信します。</p>
      <button id="sendBtn">よいしょ</button>
      <p id="status"></p>

      <script>
        const btn = document.getElementById('sendBtn');
        const status = document.getElementById('status');

        btn.addEventListener('click', () => {
          // 連打防止
          btn.disabled = true;
          status.textContent = '送信中…';

          fetch('/send')
            .then(res => res.text())
            .then(text => {
              status.textContent = text || '送信完了！';
              setTimeout(() => {
                btn.disabled = false;
                status.textContent = '';
              }, 2000);
            })
            .catch(err => {
              console.error(err);
              status.textContent = 'エラーが発生しました…';
              btn.disabled = false;
            });
        });
      </script>
    </body>
    </html>
  `);
});

// ② 実際にLINEへ送る処理
app.get('/send', async (req, res) => {
  try {
    const message = {
      to: GROUP_ID,              // グループID（Cから始まるやつ）
      messages: [
        {
          type: 'textV2',        // ★ここが textV2 になる
          // {user1} がメンションに置き換わる
          text: '{user1} ミーティングお願いします！',
          substitution: {
            user1: {
              type: 'mention',
              mentionee: {
                type: 'user',
                userId: FIXED_USER_ID // MENTION_USER_ID の値
              }
            }
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
    res.send('送信完了！');
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send('送信に失敗しました');
  }
});

// ③ Render 必須：PORT を listen してサーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
