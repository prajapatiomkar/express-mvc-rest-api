const User = require("../models/User")

const bcrypt = require("bcrypt")

const handleNewUser = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({
            "message": "Username & Password are required."
        })
    }

    // Check for duplication username in the db
    const duplicate = await User.findOne({ username: user }).exec()

    if (duplicate) {
        return res.sendStatus(409) // conflict
    }
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10)
        //create and store the new user
        const result = await User.create({ "username": user, "password": hashedPwd })

        console.log(result);

        res.status(201).json({ "succes": `New user ${user} created!` })
    } catch (error) {
        return res.status(500).json({ "message": error.message })
    }
}

module.exports = { handleNewUser }