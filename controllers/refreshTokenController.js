const usersDB = {
    users: require("../models/users.json"),
    setUsers: function (data) {
        this.users = data
    }
}

const jwt = require("jsonwebtoken")
require("dotenv").config()



const handleRefreshToken = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(401)
    }

    console.log(cookies.jwt);

    const refershToken = cookies.jwt


    const foundUser = usersDB.users.find(person => person.refershToken === refershToken)
    if (!foundUser) {
        return res.sendStatus(401) // Unauthorized
    }
    //evaluate jwt


    jwt.verify(
        refershToken,
        process.env.REFRESH_TOKEN_SECRECT,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(401)
            }

            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRECT,
                { expiresIn: "30s" }
            )
            res.json({ accessToken })
        }
    )


}
module.exports = { handleRefreshToken }