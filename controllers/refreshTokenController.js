const User = require("../models/User")
const jwt = require("jsonwebtoken")

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(401)
    }

    // console.log(cookies.jwt);

    const refershToken = cookies.jwt


    const foundUser = await User.findOne({ refershToken }).exec()
    if (!foundUser) {
        return res.sendStatus(403) // Unauthorized
    }
    //evaluate jwt


    jwt.verify(
        refershToken,
        process.env.REFRESH_TOKEN_SECRECT,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403)
            }
            const roles = Object.values(foundUser.roles)

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRECT,
                { expiresIn: "1h" }
            )
            res.json({roles, accessToken })
        }
    )


}
module.exports = { handleRefreshToken }