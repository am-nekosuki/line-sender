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
      <h1>LINE送信ボタン</h1>
      <p>下のボタンを押すと、グループにメッセージを1回送信します。</p>
      <button id="sendBtn">送信</button>
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
