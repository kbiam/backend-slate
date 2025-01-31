const express = require('express')
const {login,forgotPassword,verifyOtp,resetPassword} = require('../controllers/auth.controller')

const router = express.Router()

router.post("/login",login)
router.post("/forgotPassword",forgotPassword)
router.post("/verifyOtp",verifyOtp)
router.post("/resetPassword",resetPassword)


module.exports = router