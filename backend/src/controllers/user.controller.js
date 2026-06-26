import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
const signup =async(req,res) =>{
    const {name,email,password} = req.body;
    try {
        if(!name || !email || !password){
            return res.status(401).json({
                message:"All fields are manditory"
            })
        }
        const userExist = await userModel.findOne({});
        if(userExist){
            return res.status(400).json({
                message:"User already registered"
            })
        }
        const hashPass = await bcrypt.hash(password,10);
        const user = await userModel.create({
            name,email,password:hashPass
        })
        
        const token = jwt.sign({
            id:user._id
        }, process.env.JWT_SECRET);
        res.cookie("token",token);
        res.send(200).json({
            message:"User register successfully",
            user:{
                _id:user._id,
                email:user.email,
                name:user.name
            }
        })
    } catch (error) {
        console.log(error);
    }

}

const login = async(req,res) =>{

}

export {signup,login}