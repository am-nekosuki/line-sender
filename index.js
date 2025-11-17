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
      <p>下のボタンを押すと、グループにメッセージを1回
