const expires=require("express");
const {signup,login,verifyOtp}=require("../controllers/auth.controller")

const router=expires.Router();

router.post("/signup",signup);
router.post("/verify-otp",verifyOtp);
router.post("/login",login);

module.exports=router;