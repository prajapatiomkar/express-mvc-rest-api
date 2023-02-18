const User = require("../models/User")


const handleLogout =async (req, res) => {
    // on client also delete the accessToken

    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204) // no content
    }

    // console.log(cookies.jwt);
    const refreshToken = cookies.jwt

    // if refershToken in db 
    const foundUser = await User.findOne({refreshToken}).exec()
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true }) // , expiresIn: "1d" 
        return res.sendStatus(203)
    }

    // Delete refreshToken in DB
   foundUser.refreshToken = "";
   const result =await foundUser.save()
   console.log(result);

    res.clearCookie("jwt",{httpOnly:true, sameSite: "None", secure: true,}) //secure: true - only serves on https
    res.sendStatus(204)
}
module.exports = { handleLogout }