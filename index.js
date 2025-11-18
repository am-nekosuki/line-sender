const express = require('express');
const axios = require('axios');

const app = express();

// Render の環境変数
const CHANNEL_ACCESS_TOKEN = process.env.LINE_TOKEN;
const GROUP_ID = process.env.GROUP_ID;
// それぞれのメンション先
const KIKUCHI_USER_ID = process.env.MENTION_USER_ID_KIKUCHI;
const TSUKADA_USER_ID = process.env.MENTION_USER_ID_TSUKADA;

// ① 画面表示用（送信ボタン付きページ）
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>SO-SHIN</title>
      <style>
        body { font-family: sans-serif; padding: 40px; }
        button {
          font-size: 18px;
          padding: 10px 24px;
          cursor: pointer;
          margin-right: 12px;
          margin-bottom: 8px;
        }
        #status { margin-top: 16px; }
      </style>
    </head>
    <body>
      <h1>(/・ω・)/</h1>
      <p>下のボタンを押してね。</p>

      <button class="sendBtn" data-type="kikuchi">菊地</button>
      <button class="sendBtn" data-type="tsukada">塚田</button>

      <p id="status"></p>

      <script>
        const buttons = document.querySelectorAll('.sendBtn');
        const status = document.getElementById('status');

        function setButtonsDisabled(disabled) {
          buttons.forEach(b => b.disabled = disabled);
        }

        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');

            setButtonsDisabled(true);
            status.textContent = '送信中…';

            fetch('/send?type=' + encodeURIComponent(type))
              .then(res => res.text())
              .then(text => {
                status.textContent = text || '送信完了！';
                setTimeout(() => {
                  setButtonsDisabled(false);
                  status.textContent = '';
                }, 2000);
              })
              .catch(err => {
                console.error(err);
                status.textContent = 'エラーが発生しました…';
                setButtonsDisabled(false);
              });
          });
        });
      </script>
    </body>
    </html>
  `);
});

// 送信内容とメンション先を type ごとに管理
const messageSettings = {
  kikuchi: {
    userId: KIKUCHI_USER_ID,
    text: '{user1} \nお疲れ様です！\ngrapeの件でお客様から問い合わせがありました。詳細をメールで送りましたとのことです。\n急ぎご確認お願いします。'
  },
  tsukada: {
    userId: TSUKADA_USER_ID,
    text: '{user1} \nお疲れ様です！\n請求書の件でお客様から問い合わせがありました。詳細をメールで送りましたとのことです。\n急ぎご確認お願いします。'
  }
};

// ② 実際にLINEへ送る処理
app.get('/send', async (req, res) => {
  try {
    const type = req.query.type || 'kikuchi'; // デフォルト: 菊地
    const setting = messageSettings[type];

    if (!setting) {
      return res.status(400).send('不正な type です');
    }

    const message = {
      to: GROUP_ID,              // グループID（Cから始まるやつ）
      messages: [
        {
          type: 'textV2',
          text: setting.text,
          substitution: {
            user1: {
              type: 'mention',
              mentionee: {
                type: 'user',
                userId: setting.userId
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

    console.log('送信完了 (type=' + type + ')');
    res.send('送信完了！（' + type + '）');
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
