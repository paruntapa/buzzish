import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const middlewareRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({
                Message: "token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({
                Message: "Invalid credentials"
            })
        }
        const user = await User.findById(decoded.userId).select("-password")
        

        if(!user){
            return res.status(404).json({
                Message: "User not found"
            })
        }
        req.user = user
        next()

    } catch (error) {
        console.log(`error in middleware ${error.message}`)
        res.status(500).json({
            Message: "Internal error"
        })
    }
}