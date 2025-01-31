const db = require('../config/db')
const bcrypt = require('bcryptjs');

exports.insertToken = (otp, email, expiresAt, callback) => {
    db.query(`DELETE FROM password_resets WHERE email = ?`, [email], (err) => {
        if (err) return callback(err, null);

        db.query(
            `INSERT INTO password_resets (token, email, expires_at) VALUES (?, ?, ?)`,
            [otp, email, expiresAt],
            (err) => {
                if (err) return callback(err, null);
                callback(null);
            }
        );
    });
};


exports.checkToken = (otp,email,callback)=>{
    db.query(`SELECT * FROM password_resets WHERE token = ? AND email = ?`,[otp,email],(err,results)=>{
        if (err) return callback(err, null);
        callback(null,results);
    })
    }

exports.resetPassword = (email, newPassword, callback)=>{

        bcrypt.hash(newPassword,10,(err,hashedPaswword)=>{
            if(err) return callback(err,null);
            db.query(`UPDATE users SET password = ? WHERE email = ?`,[hashedPaswword, email],(err, results)=>{
                if(err) return callback(err,null);
                db.query(`DELETE FROM password_resets WHERE email = ?`, [email], (err) => {
                    if (err) return callback(err, null);

                    callback(null, { success: true, message: "Password reset successfully" });
                });
            })
        })
    
}