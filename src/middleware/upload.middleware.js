const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require("../config/cloudinary");


require("dotenv").config();

//storage config

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"resumes",
        format: async (req, file) => "pdf",
        public_id: async (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,    }
});

//filtering files
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==="application/pdf"){      
        cb(null,true);
    }else{
        cb(new Error("Only pdf files are allowed"),false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports=upload;