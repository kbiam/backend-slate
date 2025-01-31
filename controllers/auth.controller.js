const bcrypt = require("bcryptjs");
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const PasswordReset = require('../models/PasswordReset')
const nodemailer = require('nodemailer')
dotenv.config()

exports.login = async(req,res)=>{
    try {
        const {email, password, role} = req.body
        if(!email || !password || !role){
            return res.status(400).json({message: "Please provide all fields."})
        }
        User.findByEmail(email,async (err,user)=>{
            if (err) return res.status(500).json({ message: "Database error" });
            if (!user) return res.status(404).json({ message: "User not found" });

            
            const isValidPassword = await bcrypt.compare(password, user.Password);
            if(!isValidPassword) {
                return res.status(401).json({ message: "Invalid password" });
            }

            if(user.Role !== role){
                return res.status(401).json({ message: "Invalid role" });
            }
            console.log(user)

            const tokenPayload = {
                id: user.ID,
                role: user.Role,
                linkedStudentId: user.Role !== "School" ? user.Linked_Student_ID : null,
                schoolName: user.Role === "School" ? user.Name : undefined
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

            let redirectURL = "/";
            if (user.Role === "School") redirectURL = "/dashboard/school";
            else if (user.Role === "Parent") redirectURL = "/dashboard/parent";
            else if (user.Role === "Student") redirectURL = "/dashboard/student";
            
            /* CAN BE REDIRECTED BY SERVER SIDE, OR CAN BE REDIRECTED ON THE FRONTEND*/

            // res.cookie("token", token, { httpOnly: true }); 
            // res.redirect(redirectURL);
            res.json({ message: `Login successful as ${role}`, token, redirectURL });

        })
    } catch (error) {
        console.error(error)
    }
}

exports.forgotPassword = async(req,res)=>{
    const {email} = req.body

    if(!email){
        return res.status(400).json({message: "Please provide email."})
    }
    User.findByEmail(email,(err,user)=>{
        if (err) return res.status(500).json({ message: "Database error" });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 mins

        PasswordReset.insertToken(token,email,expiresAt,async (err)=>{
            if (err) return res.status(500).json({ message: "Error storing OTP" });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset OTP",
                text: `Your OTP for password reset is: ${token}. It expires in 10 minutes.`,
            };
            transporter.sendMail(mailOptions, (err) => {
                if (err) return res.status(500).json({ message: "Error sending email" });
                res.json({ message: "OTP sent to your email" });
            });
        })
    })
}

exports.verifyOtp = async(req, res)=>{
    const {email, otp} = req.body
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    PasswordReset.checkToken(otp,email,(err,results)=>{
        if (err) return res.status(500).json({ message: "Database error" });

        if (!results || results.length === 0) {
            return res.status(400).json({ message: "Invalid OTP" });
        }     
        const resetRequest = results[0];
        const currentTime = new Date();
        
        if (new Date(resetRequest.expires_at) < currentTime) {
            return res.status(400).json({ message: "OTP expired" });
        }
        const tempJwt = jwt.sign({email},process.env.JWT_SECRET, {expiresIn:'15m'})
        res.json({ message: "OTP verified successfully" , tempJwt});

    })
}

exports.resetPassword = async(req, res)=>{
    const {newPassword} = req.body

    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });
    
    let email
    try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;

            if (!newPassword) {
                return res.status(400).json({ message: "New password is required" });
            }

            PasswordReset.resetPassword(email, newPassword, (err, results) => {
                if (err) return res.status(500).json({ message: "Database error" });
                res.json({ message: "Password reset successfully" });
            });

      } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
      }

}