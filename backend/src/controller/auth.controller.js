import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and Password are required."})
        }

        if(
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ){
            return res.status(200).json({message: "Successfully logged in."})
        }

         return res.status(401).json({
           message: "Invalid admin credentials",
         });

    } catch (error) { 
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error" });
    }

}