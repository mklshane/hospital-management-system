import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js";
//import adminRoutes from "./routes/admin.route.js"
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());

//app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on PORT:", PORT)
} )


