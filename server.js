import express from "express"
import dotenv from "dotenv";
// import mongoose from "mongoose";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./routes/contactRoutes.js"

dotenv.config();
connectDB();
const app=express();
const PORT=process.env.PORT||6000;
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,"public")));


app.use("/api/contacts",contactRoutes);


app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});

