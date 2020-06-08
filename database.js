//const sequelize = require('sequelize');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password : process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements : true
});

db.connect((err) => {
  if (err) throw err;
  else console.log("connected to database");
});

// const db = new sequelize(process.env.DB_NAME, 
//   process.env.DB_USER, 
//   process.env.DB_PASS, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql',

//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });

module.exports = db;