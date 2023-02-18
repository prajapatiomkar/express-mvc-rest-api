const User = require("../models/User")


const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const handleLogin = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({
            "message": "Username and Password are required"
        })
    }
    const foundUser =await User.findOne({ username: user }).exec()
    if (!foundUser) {
        return res.status(401) // Unauthorized
    }
    //evaluate password
    const match = await bcrypt.compare(password, foundUser.password)

    if (match) {
        const roles = Object.values(foundUser.roles)
        //create JWT to give user permission to access route through token
        const accessToken = jwt.sign(
            {
                "UserInfo":
                {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRECT,
            { expiresIn: "1m" }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRECT,
            { expiresIn: "1d" }
        )

        // Saving refershToken with current user
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result);


        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: "None",  maxAge: 24 * 60 * 60 * 1000 }) // 24 Hours 60 minutes 60 second 1000 milli-second //secure:true
        res.json({ accessToken })


    } else {
        res.sendStatus(401)
    }
}
module.exports = { handleLogin }