var mysql = require('mysql');
const dotenv = require('dotenv')
dotenv.config();

var con = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    database:process.env.database,
    password: process.env.password
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

module.exports = con