const usersDB = {
    users: require("../models/users.json"),
    setUsers: function (data) {
        this.users = data
    }
}

const fsPromises = require("fs").promises
const path = require("path")
const bcrypt = require("bcrypt")

const handleNewUser = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({
            "message": "Username & Password are required."
        })
    }

    // Check for duplication username in the db
    const duplicate = usersDB.users.find(person => person.username === user)
    if (duplicate) {
        return res.sendStatus(409) // conflict
    }
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10)
        // store the new user
        const newUser = { "username": user, "password": hashedPwd }
        usersDB.setUsers([...usersDB.users, newUser])

        await fsPromises.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(usersDB.users)
        )
        console.log(usersDB.users)
        res.status(201).json({ "succes": `New user ${user} created!` })
    } catch (error) {
        return res.status(500).json({ "message": error.message })
    }
}

module.exports = { handleNewUser }