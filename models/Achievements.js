const db = require('../config/db')

exports.fetchAchievements = (Student_id, callback) => {

  db.query("SELECT * FROM users WHERE Linked_Student_ID = ?", [Student_id], (err, userResults) => {
      if (err) return callback(err, null);

      if (userResults.length === 0) {
          return callback(new Error("Student not found"), null);
      }

      db.query("SELECT * FROM achievements WHERE Student_id = ?", [Student_id], (err, results) => {
          if (err) return callback(err, null);
          callback(null, results);
      });
  });
};

exports.addAchievement = (Student_id, achievement, schoolName, callback) => {
  db.query("SELECT Name FROM users WHERE Linked_Student_ID = ? AND Role = 'Student'", [Student_id], (err, userResults) => {
    if (err) return callback(err, null);

    if (userResults.length === 0) {
      return callback(new Error("Student not found"), null);
    }

    const studentName = userResults[0].Name;
     console.log(schoolName)
    db.query(
      "INSERT INTO achievements (Student_id, Name, SchoolName, Achievements) VALUES (?, ?, ?, ?)", 
      [Student_id, studentName, schoolName, achievement], 
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, { message: "Achievement added successfully" });
      }
    );
  });
};


exports.updateAchievements = (achievement_id, updatedAchievement, callback) => {
  db.query("UPDATE achievements SET Achievements = ? WHERE Achievement_ID = ?", [updatedAchievement, achievement_id], (err, results) => {
    if (err) return callback(err, null);
    if (results.affectedRows === 0) {
      return callback(new Error("Achievement not found"), null);
    }
    callback(null, { message: "Achievement updated successfully" });
  });
};
exports.deleteAchievements = (achievement_id, callback) => {
  db.query("DELETE FROM achievements WHERE Achievement_ID = ?", [achievement_id], (err, results) => {
    if (err) return callback(err, null);
    if (results.affectedRows === 0) {
      return callback(new Error("Achievement not found"), null);
    }
    callback(null, { message: "Achievement deleted successfully" });
  });
};
