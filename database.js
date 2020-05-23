var mysql = require('mysql');

var con = mysql.createConnection({
  host: "mysqlcapstone.3treestech.ca",
  user: "capstonem2020",
  password: "S54Au*6zskH*9iE"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});