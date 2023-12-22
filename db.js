/** Database setup for BizTime. */
const { Client } = require("pg");
require("dotenv").config()

let DB_URI;

// process.env.DATABASE should equal "postgresql://user:password@host:5432/database"
if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.DATABASE_TEST;
} else {
  DB_URI = process.env.DATABASE;
}


let db = new Client({
  connectionString: DB_URI,
});

db.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
});

module.exports = db
