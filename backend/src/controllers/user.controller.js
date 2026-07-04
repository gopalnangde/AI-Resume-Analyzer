import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are mandatory"
            })
        }

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "User already registered"
            })
        }

        const hashPass = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email,
            password: hashPass
        })

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Signup failed"
        })
    }

}

const login = async(req,res) =>{
    const {email,password} = req.body;
    try {
        if (!email || !password) {
          return res.status(400).json({
            message: "All field are mandatory",
          });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
          return res.status(401).json({
            message: "Invalid credentials",
          });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            message: "Invalid credentials",
          });
        }

        const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );
        //Store token in cookie
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          message: "User login successfully",
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }

}

const logout = async(req,res)=>{
    try {
        res.clearCookie("token", {
          httpOnly: true,
          sameSite: "strict",
        });
        return res.status(200).json({
            message:"Logout successfully"
        })
    } catch (error) {
        console.log("Error: ",error)
        return res.status(500).json({
            message:"Internal Server Error"
        });       
    }
}

export {signup,login,logout};
