const db = require('../config/database');

async function addParticipation(eventId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO participants (event_id, user_id) VALUES (?, ?)',
      [eventId, userId],
      function (err) {
        if (err) reject(err);
        else resolve({
          id: this.lastID,
          event_id: eventId,
          user_id: userId
        });
      }
    );
  });
}

async function getParticipantsByEvent(eventId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
        users.id,
        users.last_name,
        users.first_name,
        users.email
      FROM participants
      JOIN users ON participants.user_id = users.id
      WHERE participants.event_id = ?`,
      [eventId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

async function deleteParticipation(eventId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM participants WHERE event_id = ? AND user_id = ?',
      [eventId, userId],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

module.exports = {
  addParticipation,
  getParticipantsByEvent,
  deleteParticipation
};