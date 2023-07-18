// db接続設定
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port : 32000,
    password: '****',
    database: '***', 
  });

  module.exports = connection