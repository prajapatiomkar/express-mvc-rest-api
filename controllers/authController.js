const usersDB = {
    users: require("../models/users.json"),
    setUsers: function (data) {
        this.users = data
    }
}

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const fsPromises = require("fs").promises
const path = require("path")

const handleLogin = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({
            "message": "Username and Password are required"
        })
    }
    const foundUser = usersDB.users.find(person => person.username === user)
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
            { expiresIn: "30s" }
        )
        const refershToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRECT,
            { expiresIn: "1d" }
        )

        // Saving refershToken with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = { ...foundUser, refershToken }
        usersDB.setUsers([...otherUsers, currentUser])

        await fsPromises.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(usersDB.users)
        )


        res.cookie('jwt', refershToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 }) // 24 Hours 60 minutes 60 second 1000 milli-second
        res.json({ accessToken })


    } else {
        res.sendStatus(401)
    }
}
module.exports = { handleLogin }