const app = require('./app')
const authRoutes = require("./routes/auth.routes")
const studentRoutes = require("./routes/student.routes")

const PORT = process.env.PORT || 5000;


app.use("/auth",authRoutes)
app.use("/student",studentRoutes)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });