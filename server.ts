import { checkAuthMiddleware } from "./middlewares/auth"

require("dotenv/config")
const express = require("express")
const mongoose = require("mongoose")

// Importando rotas de './routes':
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const workspaceRoutes = require("./routes/workspace")
const taskRoutes = require("./routes/task")
const subtaskRoutes = require("./routes/subtask")

const app = express()
const port = 3000

// Conectando ao BD:
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const clusterInfo = process.env.DB_CLUSTER_INFO
const server = `mongodb+srv://${user}:${password}@${clusterInfo}.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(server).then(() => {
    console.log("Database connection successfull!");
}, (e: Error) => console.error(e)
);

// Definindo rotas:
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/workspaces", checkAuthMiddleware, workspaceRoutes)
app.use("/tasks", checkAuthMiddleware, taskRoutes)
app.use("/subtasks", subtaskRoutes)

// Start server listen:
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})