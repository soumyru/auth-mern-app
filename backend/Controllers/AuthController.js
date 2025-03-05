// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

const signup = async(req,res)=> {
    try{
        const { name, email, password} = req.body;
        const user = await UserModel.findOne({email});
        
        if(user){
            return res.status(409).json({ message: "User already exists, you can login", success:false });
        }
        
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201).json({ message: "Signup successful", success: true });
    } catch(err){
        res.status(500).json({ message: "Internal Server Error", success: false })
    }
};

const login = async(req,res)=> {
    try{
        const { email, password} = req.body;
        const user = await UserModel.findOne({email});
        const errMsg = "Auth failed email or password is wrong";
        if(!user){
            return res.status(403).json({ message: errMsg, success:false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual){
            return res.status(403).json({ message: errMsg, success:false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id:user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200).json({ 
            message: "Login successful", 
            success: true,
            jwtToken,
            email,
            name: user.name 
        });
    } catch(err){
        res.status(500).json({ message: "Internal Server Error", success: false })
    }
};

module.exports = { signup, login };