const db = require('../config/database');

async function createUser(last_name, first_name, email, password) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (last_name, first_name, email, password) VALUES (?, ?, ?, ?)',
      [last_name, first_name, email, password],
      function (err) {
        if (err) reject(err);
        else resolve({
          id: this.lastID,
          last_name,
          first_name,
          email
        });
      }
    );
  });
}

async function findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function findById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

module.exports = {
  createUser,
  findByEmail,
  findById
};