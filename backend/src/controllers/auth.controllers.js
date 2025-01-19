import { genToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) =>{
    const { username, email, password } = req.body
    try {
        if(!username || !password || !email){
            return res.status(400).json({
                Message: "Username, password, & email is required"
            })
        }
        if(password.length < 6){
            return res.status(400).json({
                Message: "Password cannot be less then 6 Characters"
            })
        }
        if(email == "@gmail.com"){
            return res.status(400).json({
                Message: "email cannot start with @gmail.com"
            })
        }

        const user = await User.findOne({
            email
        })

        if(user){
            return res.status(400).json({
                Message: "User already exist"
            })

            
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            password: hashedPassword,
            email
        })
        
        if(newUser){
            genToken(newUser._id, res)
            await newUser.save();

            res.status(200).json({
                Message: "User has been created",
                _id: newUser._id,
                user: username,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({
                Message: "Error while Creating a new User"
            })
        }

    } catch (error) {
        console.log(`Error in signup controllers ${error.message}`);
        return res.status(500).json({
            Message: "Server Error"
        })
    }
}

export const signin = async (req, res) =>{
    const { username, password } = req.body;

    try {
        if ( !username || !password ){
            return res.status(400).json({
                message: "fields cannot be empty"
            })
        }

        const user = await User.findOne({
            username
        })

        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const token = genToken(user._id, res)

        res.status(200).json({
            user: user._id,
            username: user.username,
            profilePic: user.profilePic,
            email: user.email,
            message: token
        })
        
    } catch (error) {
        console.log(`Error in login controllers ${error.message}`)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const signout = (req, res) =>{
    try {
        res.cookie("jwt", "", {MaxAge:0});
        res.status(200).json({
            message: "Logged out successfully"
        })
    } 
    catch (error) {
        console.log(`Error while loging out ${error.message}`)
        res.status(500).json({
            message: "Logout Error"
        })
    }

}

export const profilePicUpdate = async (req, res) =>{

    try {
        const {profileImage} = req.body;
        const userId = req.user;
        console.log(profileImage)
        if(!profileImage){
            return res.status(400).json({
                message: "Profile Picture not found"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profileImage)
        console.log(uploadResponse)
        if(!uploadResponse){
            return alert("Profile Picture not Uploaded to Database")
                
                // message: "Profile Picture not Uploaded to Database"
            
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {profileImage: uploadResponse.secure_url}, 
            {new:true}
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(`error while updating User ${error.message}`)
        res.status(500).json({
            message: "users profile picture was not updated"
        })
    }
}

export const checkAuth = async (req, res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(`Error in Auth ${error.message}`)
        res.status(500).json({
            message: "Interval server error"
        })
    }
}