const db = require('../config/database');

async function getAllEvents() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM events ORDER BY start_date DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function createEvent(title, description, start_date, end_date, location) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO events (title, description, start_date, end_date, location) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', start_date, end_date, location || ''],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

async function getEventById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function updateEvent(id, data) {
  return new Promise((resolve, reject) => {
    const { title, description, start_date, end_date, location } = data;
    db.run(
      'UPDATE events SET title = ?, description = ?, start_date = ?, end_date = ?, location = ? WHERE id = ?',
      [title, description, start_date, end_date, location, id],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

async function deleteEvent(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

module.exports = {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
};