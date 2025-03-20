const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const User=require("../models/user.model");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true});

const createAdmin=async()=>{
    const existingAdmin=await User.findOne({role:"admin"});
    if(existingAdmin){
        console.log("Admin already exists");
        return process.exit(1);
    }
    const hashedPassword=await bcrypt.hash("Ram@9836",10);
    const admin=new User({
        name:"Admin",
        email:"jangir55@gmail.com",
        password:"Ram@9836",
        role:"admin",
        isVerified:true,
    })
    await admin.save();
    console.log("Admin created successfully");
    process.exit(0);
}
createAdmin();