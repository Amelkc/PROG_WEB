//https://www.youtube.com/watch?v=ycTvQtsWhvY

const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./data/eventhub.db", (err) => { 
  if (err) console.error("Erreur DB:", err.message);
  else console.log("eventhub.db initialized");
});

// Tables EventHub based on the samsung notes pdf
db.serialize(() => {  
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,     
    end_date TEXT NOT NULL,
    location TEXT NOT NULL
  )`, (err) => err ? console.error(err) : console.log("Table events initialized"));

  db.run(`CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY(event_id) REFERENCES events(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`, (err) => err ? console.error(err) : console.log("Table participants initialized"));
  
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);
});

console.log("Database initialized");

module.exports = db;