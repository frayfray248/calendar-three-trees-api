var mysql = require('mysql');

var database = mysql.createConnection({
  host: "mysqlcapstone.3treestech.ca",
  user: "capstonem2020",
  password: "S54Au*6zskH*9iE",
  database: "capstonescheduling2020m",
  port: '3306'
});

module.exports = database;