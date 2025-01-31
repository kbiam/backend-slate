const achievements = require("../models/Achievements")
const User = require("../models/User")

exports.fetchAchievements = async(req,res)=>{
    const {student_id} = req.params
    const {role, id, linkedStudentId} = req.user
        
        if(role === "Student" && student_id != linkedStudentId){
            return res.status(403).json({ message: "Forbidden: Cannot access other students' data"})
        }

        if(role === "Parent" && student_id != linkedStudentId){
            return res.status(403).json({ message: "Forbidden: Not linked to this student"})
        }

        if (role === "School") {
        } else if (role !== "Student" && role !== "Parent") {
            return res.status(403).json({ message: "Forbidden: Unauthorized role" });
        }
    
        achievements.fetchAchievements(student_id,(err,achievements)=>{
            if (err) {
                if (err.message === "Student not found") {
                    return res.status(404).json({ message: "Student not found" });
                }
                return res.status(500).json({ message: "Internal Server Error" });
            }           
            if (!achievements || achievements.length === 0) {
                return res.status(404).json({ message: "Achievements not found" });
            }
            const achievementsList = achievements.map(element => element.Achievements);

            res.json({achievements:achievementsList})
            
        })
}

exports.addAchievements = async (req, res) => {
    const { student_id } = req.params;
    const { role, schoolName } = req.user;
    const { achievement } = req.body;

    if (role !== "School") {
        return res.status(403).json({ message: "Forbidden: You are not authorized to access this API" });
    }

    if (!achievement || achievement.trim() === "") {
        return res.status(400).json({ message: "Bad Request: Achievement cannot be empty" });
    }
        console.log(schoolName)
        achievements.addAchievement(student_id,achievement,schoolName,(err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }
                res.status(200).json({ message: "Achievement added successfully" });
            }
        );
    
};


exports.updateAchievements = async (req, res) => {
    const { achievement_id } = req.params;
    const { role } = req.user;
    const { updatedAchievement } = req.body;

    if (role !== "School") {
        return res.status(403).json({ message: "Forbidden: You are not authorized to update achievements" });
    }

    if (!updatedAchievement || updatedAchievement.trim() === "") {
        return res.status(400).json({ message: "Bad Request: Achievement cannot be empty" });
    }

    achievements.updateAchievements(achievement_id, updatedAchievement, (err, result) => {
        if (err) {
            if (err.message === "Achievement not found") {
                return res.status(404).json({ message: "Achievement not found" });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.status(200).json({ message: "Achievement updated successfully" });
    });
};

exports.deleteAchievements = async (req, res) => {
    const { achievement_id } = req.params;
    const { role } = req.user;

    if (role !== "School") {
        return res.status(403).json({ message: "Forbidden: You are not authorized to delete achievements" });
    }

    achievements.deleteAchievements(achievement_id, (err, result) => {
        if (err) {
            if (err.message === "Achievement not found") {
                return res.status(404).json({ message: "Achievement not found" });
            }

            console.log(err)
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.status(200).json({ message: "Achievement deleted successfully" });
    });
};
