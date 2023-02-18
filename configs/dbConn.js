const mongoose = require("mongoose")
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = connectDB