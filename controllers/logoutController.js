const usersDB = {
    users: require("../models/users.json"),
    setUsers: function (data) {
        this.users = data
    }
}

const fsPromises = require("fs").promises
const path = require("path")


const handleLogout =async (req, res) => {
    // on client also delete the accessToken

    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204) // no content
    }

    // console.log(cookies.jwt);
    const refershToken = cookies.jwt

    // if refershToken in db 
    const foundUser = usersDB.users.find(person => person.refershToken === refershToken)
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true }) // , expiresIn: "1d" 
        return res.sendStatus(203)
    }

    // Delete refreshToken in DB
    const otherUsers = usersDB.users.filter(person => person.refershToken != foundUser.refershToken)
    const currentUser = { ...foundUser, refershToken: "" }
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname,"..","models","users.json"),
        JSON.stringify(usersDB.users)
    )

    res.clearCookie("jwt",{httpOnly:true, sameSite: "None", secure: true,}) //secure: true - only serves on https
    res.sendStatus(204)
}
module.exports = { handleLogout }