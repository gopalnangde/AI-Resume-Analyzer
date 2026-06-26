import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected Successfully");
    } catch (error) {
        console.error("Error while connecting database: ",error);
    }
    
}
export default connectDB;