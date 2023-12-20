/** Database setup for BizTime. */
const { Client } = require("pg");


let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///biztime_test";
} else {
  DB_URI = "postgresql:///biztime";
}

let db = new Client({
    // host: Enter host here example "localhost",
    // user: Enter user here example "username",
    // port: Enter port here example 5432,
    // password: Enter password here example "password123!",
    // database: Enter database here example "biztime"
})

db.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
});

module.exports = db
