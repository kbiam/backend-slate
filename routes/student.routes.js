const express = require('express')
const {fetchAchievements,addAchievements,updateAchievements,deleteAchievements} = require('../controllers/student.controller')
const {verifyToken} = require("../middleware/auth.middleware")
const router = express.Router()

router.get("/achievements/:student_id",verifyToken,fetchAchievements)
router.post("/achievements/add/:student_id",verifyToken,addAchievements)
router.post("/achievements/update/:achievement_id",verifyToken,updateAchievements)
router.post("/achievements/delete/:achievement_id",verifyToken,deleteAchievements)

module.exports = router