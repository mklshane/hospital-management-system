import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js";
//import adminRoutes from "./routes/admin.route.js"
import authRoutes from "./routes/auth.route.js"
import docRoutes from "./routes/doctor.route.js"
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());


//app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/doc", docRoutes)

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on PORT:", PORT)
} )


