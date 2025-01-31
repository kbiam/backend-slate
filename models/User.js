const db = require('../config/db')

exports.findByEmail = (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results,fields) => {
      if (err) return callback(err, null);
      callback(null, results[0]); // Return first user if found
    });
  };

